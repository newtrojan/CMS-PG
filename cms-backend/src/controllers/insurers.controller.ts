import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errors";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const prisma = new PrismaClient();

export const createInsurer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, billingEmail, carrierNote, pricingRules } =
      req.body;

    const insurer = await prisma.insurer.create({
      data: {
        name,
        address,
        phone,
        billingEmail,
        carrierNote,
        pricingRules: {
          create: pricingRules,
        },
      },
      include: {
        pricingRules: true,
      },
    });

    ApiResponse.success(res, insurer, "Insurer created successfully", 201);
  }
);

export const getInsurers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const insurers = await prisma.insurer.findMany({
      include: {
        pricingRules: true,
      },
    });

    ApiResponse.success(res, insurers, "Insurers retrieved successfully");
  }
);

export const getInsurer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const insurer = await prisma.insurer.findUnique({
      where: { id },
      include: {
        pricingRules: true,
      },
    });

    if (!insurer) {
      throw new AppError("Insurer not found", 404);
    }

    ApiResponse.success(res, insurer, "Insurer retrieved successfully");
  }
);

export const updateInsurer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
        pricingRules: {
          update: pricingRules,
        },
      },
      include: {
        pricingRules: true,
      },
    });

    ApiResponse.success(res, insurer, "Insurer updated successfully");
  }
);

export const deleteInsurer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.insurer.delete({
      where: { id },
    });

    ApiResponse.success(res, null, "Insurer deleted successfully");
  }
);
