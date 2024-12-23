import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errors";
import { Role } from "../config/auth";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

export class InsurersController {
  /**
   * Get all insurers
   * @access CCM, ADMIN, SUDO
   */
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const insurers = await prisma.insurer.findMany({
        include: {
          pricingRules: true,
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
   * Create new insurer
   * @access ADMIN, SUDO
   */
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, address, phone, billingEmail, carrierNote, pricingRules } =
        req.body;

      // Validate required fields
      if (!name || !address || !phone || !billingEmail) {
        throw new AppError("Missing required fields", 400);
      }

      const insurer = await prisma.insurer.create({
        data: {
          name,
          address,
          phone,
          billingEmail,
          carrierNote,
          pricingRules: pricingRules
            ? {
                create: pricingRules,
              }
            : undefined,
        },
        include: {
          pricingRules: true,
        },
      });

      return ApiResponse.success(
        res,
        insurer,
        "Insurer created successfully",
        201
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to create insurer",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  /**
   * Update insurer
   * @access ADMIN, SUDO
   */
  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, address, phone, billingEmail, carrierNote, pricingRules } =
        req.body;

      const insurer = await prisma.insurer.update({
        where: { id },
        data: {
          name,
          address,
          phone,
          billingEmail,
          carrierNote,
          pricingRules: pricingRules
            ? {
                upsert: {
                  create: pricingRules,
                  update: pricingRules,
                },
              }
            : undefined,
        },
        include: {
          pricingRules: true,
        },
      });

      return ApiResponse.success(res, insurer, "Insurer updated successfully");
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to update insurer",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  /**
   * Delete insurer
   * @access SUDO only
   */
  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.insurer.delete({
        where: { id },
      });

      return ApiResponse.success(res, null, "Insurer deleted successfully");
    } catch (error) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to delete insurer",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }
}
