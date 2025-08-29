import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import emailService from "../services/emailService";
import { generateToken } from "../middleware/auth";
import {
  ApiResponse,
  RegisterBody,
  LoginBody,
  VerifyOTPBody,
  AuthRequest,
} from "../types";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request<{}, ApiResponse, RegisterBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { name, email, dateOfBirth, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists with this email",
        error: "Email already registered",
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      dateOfBirth: new Date(dateOfBirth),
      password,
    });

    // Generate OTP
    const otp = user.generateVerificationToken();
    await user.save();

    // Send OTP email
    try {
      await emailService.sendOTPEmail(email, name, otp);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for verification code.",
      data: {
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message || "Server error",
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (
  req: Request<{}, ApiResponse, VerifyOTPBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Hash the provided OTP to compare with stored hash
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Find user with matching email and verification token
    const user = await User.findOne({
      email,
      verificationToken: hashedOTP,
    }).select("+verificationToken");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
        error: "OTP verification failed",
      });
      return;
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail verification if welcome email fails
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to HD Notes.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message || "Server error",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request<{}, ApiResponse, LoginBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
        error: "Missing credentials",
      });
      return;
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error: "User not found",
      });
      return;
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error: "Password incorrect",
      });
      return;
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP
      const otp = user.generateVerificationToken();
      await user.save();

      // Send OTP email
      try {
        await emailService.sendOTPEmail(user.email, user.name, otp);
      } catch (emailError) {
        console.error("Error sending OTP email:", emailError);
      }

      res.status(401).json({
        success: false,
        message:
          "Please verify your email address. A new verification code has been sent.",
        error: "Account not verified",
        data: {
          email: user.email,
          requiresVerification: true,
        },
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message || "Server error",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const user = req.user!;

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message || "Server error",
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (
  req: Request<{}, ApiResponse, { email: string }>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found with this email",
        error: "User not found",
      });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: "Account is already verified",
        error: "Already verified",
      });
      return;
    }

    // Generate new OTP
    const otp = user.generateVerificationToken();
    await user.save();

    // Send OTP email
    try {
      await emailService.sendOTPEmail(user.email, user.name, otp);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send verification email",
        error: "Email service error",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
      data: {
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message || "Server error",
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    // Since we're using stateless JWT, we just send a success response
    // In a production app, you might want to implement a token blacklist
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message || "Server error",
    });
  }
};
