import { Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errors";
import { AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import type { Insurer, PricingRules } from "@prisma/client";

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

      console.log(`Updating insurer ${id}...`);

      // First, get the existing insurer with pricing rules
      const existingInsurer = await prisma.insurer.findUnique({
        where: { id },
        include: { pricingRules: true },
      });

      if (!existingInsurer) {
        console.error(`Insurer ${id} not found`);
        return ApiResponse.error(res, "Insurer not found", 404);
      }

      // Prepare pricing rules data
      const pricingRulesData = {
        domesticWindshield: Number(pricingRules.domesticWindshield) || 0,
        domesticTempered: Number(pricingRules.domesticTempered) || 0,
        foreignWindshield: Number(pricingRules.foreignWindshield) || 0,
        foreignTempered: Number(pricingRules.foreignTempered) || 0,
        oem: Number(pricingRules.oem) || 0,
        laborType: pricingRules.laborType || "FLAT",
        laborTypeValue: Number(pricingRules.laborTypeValue) || 0,
        glassLaborRate: Number(pricingRules.glassLaborRate) || 0,
        defaultHourlyRate: Number(pricingRules.defaultHourlyRate) || 0,
        laborDomesticWindshield:
          Number(pricingRules.laborDomesticWindshield) || 0,
        laborDomesticTempered: Number(pricingRules.laborDomesticTempered) || 0,
        laborForeignWindshield:
          Number(pricingRules.laborForeignWindshield) || 0,
        laborForeignTempered: Number(pricingRules.laborForeignTempered) || 0,
        otherKitFlat: Number(pricingRules.otherKitFlat) || 0,
        kitFlat1: Number(pricingRules.kitFlat1) || 0,
        kitFlat1_5: Number(pricingRules.kitFlat1_5) || 0,
        kitFlat2: Number(pricingRules.kitFlat2) || 0,
        kitFlat2_5: Number(pricingRules.kitFlat2_5) || 0,
        kitFlat3: Number(pricingRules.kitFlat3) || 0,
      };

      // Update insurer
      const updatedInsurer = await prisma.insurer.update({
        where: { id },
        data: {
          name,
          address,
          phone,
          billingEmail,
          carrierNote,
          pricingRules: {
            upsert: {
              create: pricingRulesData,
              update: pricingRulesData,
            },
          },
        },
        include: {
          pricingRules: true,
        },
      });

      console.log(`Insurer ${id} updated successfully`);
      return ApiResponse.success(
        res,
        updatedInsurer,
        "Insurer updated successfully"
      );
    } catch (error) {
      console.error(
        `Failed to update insurer: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "Failed to update insurer",
        500
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

  // Helper function to compare objects and find modified fields
  static getModifiedFields(
    original: Partial<Insurer & { pricingRules: PricingRules }>,
    updated: Partial<Insurer & { pricingRules: PricingRules }>
  ) {
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    (Object.keys(updated) as Array<keyof typeof updated>).forEach((key) => {
      const originalValue = original[key];
      const updatedValue = updated[key];

      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changes[key] = {
          from: originalValue,
          to: updatedValue,
        };
      }
    });

    return changes;
  }
}
