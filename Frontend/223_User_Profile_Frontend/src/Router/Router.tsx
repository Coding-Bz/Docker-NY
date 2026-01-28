import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../components/pages/LoginPage/LoginPage";
import AdminPage from "../components/pages/AdminPage/AdminPage";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../components/pages/HomePage";
import AuthenticatedHomePage from "../components/pages/AuthenticatedHomePage";
import UserTable from "../components/pages/UserPage/UserTable";
import UserPage from "../components/pages/UserPage/UserPage";
import authorities from "../config/Authorities";

/**
 * Router component renders a route switch with all available pages
 */

const Router = () => {
  /** navigate to different "home"-locations depending on Role the user have */

  const isLoggedIn = () => localStorage.getItem("token") !== null;

  return (
    <Routes>
      <Route
        path={"/"}
        element={isLoggedIn() ? <AuthenticatedHomePage /> : <HomePage />}
      />
      <Route path={"/login"} element={<LoginPage />} />
      <Route
        path={"/admin"}
        element={<PrivateRoute requiredAuths={[]} element={<AdminPage />} />}
      />

      <Route
        path={"/user"}
        element={<PrivateRoute requiredAuths={[]} element={<UserTable />} />}
      />
      <Route
        path="/user/edit/:userId"
        element={<PrivateRoute requiredAuths={[]} element={<UserPage />} />}
      />

      <Route
        path="/user/edit"
        element={
          <PrivateRoute
            requiredAuths={[authorities.USER_CREATE]}
            element={<UserPage />}
          />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
