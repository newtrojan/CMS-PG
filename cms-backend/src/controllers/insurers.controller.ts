import { Request, Response } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/errors";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../middleware/auth";

export class InsurersController {
  /**
   * Get public list of insurers (no auth required)
   */
  static async getPublicList(req: Request, res: Response) {
    try {
      const insurers = await prisma.insurer.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return ApiResponse.success(res, insurers);
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to fetch insurers",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  /**
   * Get all insurers (protected)
   */
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const insurers = await prisma.insurer.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return ApiResponse.success(res, insurers);
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to fetch insurers",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  /**
   * Create a new insurer (protected)
   */
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        throw new AppError("Name is required", 400);
      }

      const insurer = await prisma.insurer.create({
        data: {
          name,
        },
      });

      return ApiResponse.success(res, insurer, "201");
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to create insurer",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  /**
   * Update an insurer (protected)
   */
  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        throw new AppError("Name is required", 400);
      }

      const insurer = await prisma.insurer.update({
        where: { id },
        data: {
          name,
        },
      });

      return ApiResponse.success(res, insurer);
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to update insurer",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  /**
   * Delete an insurer (protected)
   */
  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.insurer.delete({
        where: { id },
      });

      return ApiResponse.success(res, {
        message: "Insurer deleted successfully",
      });
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to delete insurer",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }
}
