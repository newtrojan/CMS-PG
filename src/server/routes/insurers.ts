import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const insurers = await prisma.insurer.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
    res.json(insurers);
  } catch (error) {
    console.error("Error fetching insurers:", error);
    res.status(500).json({ error: "Failed to fetch insurers" });
  }
});

export default router;
