import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest, JWTPayload, ApiResponse } from "../types";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: "Not authorized to access this route",
        error: "No token provided",
      };
      res.status(401).json(response);
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      // Get user from token
      const user = await User.findById(decoded.id).select("+password");

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: "Not authorized to access this route",
          error: "User not found",
        };
        res.status(401).json(response);
        return;
      }

      // Check if user is verified
      if (!user.isVerified) {
        const response: ApiResponse = {
          success: false,
          message: "Please verify your email address first",
          error: "Account not verified",
        };
        res.status(401).json(response);
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error("JWT Error:", jwtError);
      const response: ApiResponse = {
        success: false,
        message: "Not authorized to access this route",
        error: "Invalid token",
      };
      res.status(401).json(response);
      return;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    const response: ApiResponse = {
      success: false,
      message: "Server error in authentication",
      error: "Authentication failed",
    };
    res.status(500).json(response);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as JWTPayload;
        const user = await User.findById(decoded.id);

        if (user && user.isVerified) {
          req.user = user;
        }
      } catch (jwtError) {
        // Token is invalid, but we continue without user
        console.log("Invalid token in optional auth, continuing without user");
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

// Utility function to generate JWT token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET! as string, {
    expiresIn: "7d"
  });
};
