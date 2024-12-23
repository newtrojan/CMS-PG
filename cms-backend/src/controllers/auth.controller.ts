// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errors";
import { Role } from "../config/auth";
import { AuthenticatedRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../db";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      return ApiResponse.success(
        res,
        user,
        "User registered successfully",
        201
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Registration failed",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  static async login(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: "Request body is missing",
        });
      }

      const { email, password } = req.body;
      console.log("Login attempt:", { email });

      try {
        const result = await AuthService.login(email, password);
        console.log("Login successful");

        return res.json({
          success: true,
          data: result,
        });
      } catch (error) {
        if (error instanceof AppError) {
          return res.status(error.statusCode).json({
            success: false,
            message: error.message,
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Login error details:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        debug:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      // If using sessions/tokens that need invalidation on backend
      // Add that logic here

      return ApiResponse.success(res, null, "Logged out successfully");
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message || "Logout failed",
        error.statusCode || 500
      );
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await AuthService.getProfile(req.user!.userId);
      return ApiResponse.success(res, user, "Profile retrieved successfully");
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to get profile",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await AuthService.updateProfile(req.user!.id, req.body);
      return ApiResponse.success(res, user, "Profile updated successfully");
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to update profile",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }
}
