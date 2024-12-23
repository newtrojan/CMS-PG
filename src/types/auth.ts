import { Role } from "../constants/roles";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}
