// Auth types based on the backend API documentation

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  profilePicture: string;
  role: "user" | "admin" | "doctor";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
