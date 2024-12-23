import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler";

const prisma = new PrismaClient();

// Get all claims with pagination
export const getClaims = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [claims, total] = await Promise.all([
    prisma.claim.findMany({
      skip,
      take: limit,
      include: {
        vehicleInfo: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.claim.count(),
  ]);

  res.json({
    success: true,
    data: claims,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

// Get single claim
export const getClaim = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const claim = await prisma.claim.findUnique({
    where: { id },
    include: {
      vehicleInfo: true,
      parts: true,
      documents: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!claim) {
    return res.status(404).json({
      success: false,
      error: "Claim not found",
    });
  }

  res.json({
    success: true,
    data: claim,
  });
});

// Create new claim
export const createClaim = asyncHandler(async (req: Request, res: Response) => {
  const { vehicleInfo, ...claimData } = req.body;

  const claim = await prisma.claim.create({
    data: {
      ...claimData,
      vehicleInfo: {
        create: vehicleInfo,
      },
    },
    include: {
      vehicleInfo: true,
    },
  });

  res.status(201).json({
    success: true,
    data: claim,
  });
});

// Update claim
export const updateClaim = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { vehicleInfo, ...claimData } = req.body;

  const claim = await prisma.claim.update({
    where: { id },
    data: {
      ...claimData,
      vehicleInfo: vehicleInfo
        ? {
            update: vehicleInfo,
          }
        : undefined,
    },
    include: {
      vehicleInfo: true,
      parts: true,
      documents: true,
    },
  });

  res.json({
    success: true,
    data: claim,
  });
});

// Delete claim
export const deleteClaim = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.claim.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: {},
  });
});

// Add part to claim
export const addPartToClaim = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const partData = req.body;

    const part = await prisma.part.create({
      data: {
        ...partData,
        claim: {
          connect: { id },
        },
      },
    });

    // Update claim total amount
    await prisma.claim.update({
      where: { id },
      data: {
        totalAmount: {
          increment: partData.quantity * partData.unitPrice,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: part,
    });
  }
);

// Upload document
export const uploadDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type, url } = req.body;

    const document = await prisma.document.create({
      data: {
        name,
        type,
        url,
        claim: {
          connect: { id },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  }
);
