// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errors";
import { Role } from "../config/auth";
import { AuthenticatedRequest } from "../middleware/auth";

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
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, result, "Login successful");
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Login failed",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      // Just return success since we're using JWT
      return ApiResponse.success(res, null, "Logout successful");
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Logout failed",
        error instanceof AppError ? error.statusCode : 500
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

  static async updateProfile(req: Request, res: Response) {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);
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
