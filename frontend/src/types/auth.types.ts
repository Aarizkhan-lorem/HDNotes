export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  isVerified: boolean;
  createdAt?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
  error?: string;
}
