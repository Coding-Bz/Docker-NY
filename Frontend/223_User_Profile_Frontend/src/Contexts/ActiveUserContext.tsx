import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/Api";
import roles from "../config/Roles";
import AuthorityService from "../Services/AuthorityService";
import UserService from "../Services/UserService";
import { User } from "../types/models/User.model";
import { Nullable } from "../types/Nullable";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  exp?: number;
};

export const USER_DATA_LOCAL_STORAGE_KEY = "user";
export const TOKEN_LOCAL_STORAGE_KEY = "token";

export type ActiveUserContextType = {
  user: Nullable<User>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setActiveUser: (user: User) => void;
  loadActiveUser: () => void;
  checkRole: (roleToCheck: keyof typeof roles) => boolean;
};

const noContextProviderFound = () => {
  throw new Error("No provider for the ActiveUserContext found");
};

const defaultContextValue: ActiveUserContextType = {
  user: null,
  login: noContextProviderFound,
  logout: noContextProviderFound,
  setActiveUser: noContextProviderFound,
  loadActiveUser: noContextProviderFound,
  checkRole: noContextProviderFound,
};

const ActiveUserContext =
  createContext<ActiveUserContextType>(defaultContextValue);
export default ActiveUserContext;

type ActiveUserContextProviderProps = {
  children: React.ReactNode;
};

export const ActiveUserContextProvider = ({
  children,
}: ActiveUserContextProviderProps) => {
  const navigate = useNavigate();

  const loadSavedUserData = (): Nullable<User> => {
    const storedUser = localStorage.getItem(USER_DATA_LOCAL_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [user, setUser] = useState<Nullable<User>>(loadSavedUserData);

  const setActiveUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(
      USER_DATA_LOCAL_STORAGE_KEY,
      JSON.stringify(updatedUser),
    );
  };

  const resetAuthorization = () => {
    AuthorityService.clearAuthorities();
    localStorage.clear();
    setUser(null);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
    } finally {
      resetAuthorization();
      navigate("/login", { replace: true });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("user/login", { email, password });
      const authHeader =
        response.headers.authorization || response.headers.Authorization;

      if (!authHeader) throw new Error("No authorization header");

      localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, authHeader);

      const tokenString = authHeader.replace("Bearer ", "");
      const decoded = jwtDecode<JwtPayload>(tokenString);

      const fetchedUser = await UserService.getUser(decoded.sub);
      setActiveUser(fetchedUser);

      return true;
    } catch (error) {
      resetAuthorization();
      throw error;
    }
  };

  const loadActiveUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
      if (!token) return;

      const tokenString = token.replace("Bearer ", "");
      const decoded = jwtDecode<JwtPayload>(tokenString);

      const fetchedUser = await UserService.getUser(decoded.sub);
      setActiveUser(fetchedUser);
    } catch {
      resetAuthorization();
    }
  };

  const activeUserHasRole = (roleToCheck: keyof typeof roles): boolean =>
    !!user?.roles.some((role) => role.name === roleToCheck);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)) {
      loadActiveUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      AuthorityService.initAuthoritySet(user);
    }
  }, [user]);

  return (
    <ActiveUserContext.Provider
      value={{
        user,
        login,
        logout,
        setActiveUser,
        loadActiveUser,
        checkRole: activeUserHasRole,
      }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
};
