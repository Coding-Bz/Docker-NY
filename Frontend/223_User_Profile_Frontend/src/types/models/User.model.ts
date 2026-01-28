import { Role } from "./Role.model";

export interface UserRegister {
  email: string;
  firstName: string;
  lastName: string;
  password: string; 
  profile: {
    address: string;
    birthDate: string;
    profileImageUrl: string;
  };
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  password?: string;
  profile: UserRegister["profile"];
};

