import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import { ApiResponse } from "./types";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`
  );
  next();
});

// Health check route
app.get("/api/health", (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: "HD Notes Server is Up and Running! 🚀",
    data: {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    },
  };
  res.json(response);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// API documentation route
app.get("/api", (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: "HD Notes API v1.0.0",
    data: {
      endpoints: {
        auth: {
          register: "POST /api/auth/register",
          verifyOtp: "POST /api/auth/verify-otp",
          login: "POST /api/auth/login",
          logout: "POST /api/auth/logout",
          me: "GET /api/auth/me",
          resendOtp: "POST /api/auth/resend-otp",
        },
        notes: {
          getAllNotes: "GET /api/notes",
          createNote: "POST /api/notes",
          getNote: "GET /api/notes/:id",
          updateNote: "PUT /api/notes/:id",
          deleteNote: "DELETE /api/notes/:id",
          getStats: "GET /api/notes/stats",
        },
      },
      authentication: "Bearer Token required for protected routes",
      documentation: "Visit /api/health for server status",
    },
  };
  res.json(response);
});

// 404 handler for API routes
app.all("/api/*", (req, res) => {
  const response: ApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: "Not Found",
  };
  res.status(404).json(response);
});

// Global error handler
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error handler:", error);

    let statusCode = 500;
    let message = "Internal Server Error";

    // Mongoose validation error
    if (error.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((val: any) => val.message)
        .join(", ");
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      statusCode = 400;
      const field = Object.keys(error.keyValue)[0];
      message = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`;
    }

    // Mongoose cast error
    if (error.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format";
    }

    // JWT errors
    if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    }

    if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
    }

    const response: ApiResponse = {
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? error.stack
          : "Something went wrong",
    };

    res.status(statusCode).json(response);
  }
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 HD Notes Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || "development"}
📊 Database: ${process.env.MONGODB_URI ? "Connected" : "URI not set"}
📧 Email Service: ${process.env.EMAIL_USER ? "Configured" : "Not configured"}
⏰ Started at: ${new Date().toLocaleString()}
  `);
});

export default app;
