import { api } from "./api";
import type { LoginData, RegisterData } from "../types/auth.types";
import type { AuthResponse } from "../types/auth.types";
import { API_ENDPOINTS } from "../utils/constants";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  verifyOTP: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      email,
      otp,
    });
    return response.data;
  },

  resendOTP: async (email: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};
