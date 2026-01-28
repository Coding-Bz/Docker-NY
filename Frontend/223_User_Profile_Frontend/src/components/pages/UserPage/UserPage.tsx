import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../../../types/models/User.model";
import UserService from "../../../Services/UserService";
import UserForm from "../../molecules/UserForm/UserForm";

const emptyUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  roles: [],
  profile: {
    address: "",
    birthDate: "",
    profileImageUrl: "",
  },
};

const UserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User>(emptyUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    UserService.getUser(userId)
      .then((res) => setUser(res))
      .finally(() => setLoading(false));
  }, [userId]);

  const submitActionHandler = async (values: User) => {
    setLoading(true);

    try {
      const userPayload = {
        id: values.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roles: values.roles,
        password : values.password!,
        profile: {
          address: values.profile.address,
          birthDate: values.profile.birthDate,
          profileImageUrl: values.profile.profileImageUrl,
        },
      };

      if (userId) {
        // EDIT
        await UserService.updateUser(userPayload);
      } else {
        // CREATE
        await UserService.addUser(userPayload);
      }

      navigate("/user");
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) throw backendErrors;
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (loading && userId) {
    return <div>Loading...</div>;
  }

  return <UserForm user={user} submitActionHandler={submitActionHandler} />;
};

export default UserPage;
