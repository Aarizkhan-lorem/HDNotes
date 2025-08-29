import { Document } from "mongoose";
import { Request } from "express";

// User Interface
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  generateVerificationToken(): string;
  generateResetPasswordToken(): string;
}

// Note Interface
export interface INote extends Document {
  _id: string;
  title: string;
  content: string;
  user: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Request Interface
export interface AuthRequest extends Request {
  user?: IUser;
}

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Login/Register Request Bodies
export interface RegisterBody {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface VerifyOTPBody {
  email: string;
  otp: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string;
}

// Note Request Bodies
export interface CreateNoteBody {
  title: string;
  content: string;
}

export interface UpdateNoteBody {
  title?: string;
  content?: string;
}

// JWT Payload
export interface JWTPayload {
  id: string;
  email: string;
}

// Email Template Data
export interface EmailData {
  to: string;
  subject: string;
  html: string;
}
