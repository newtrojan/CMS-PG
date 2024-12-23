import { Router, Request, Response, NextFunction } from "express";
import { InsurersController } from "../controllers/insurers.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Public routes (no auth required)
router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await InsurersController.getPublicList(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.get(
  "/",
  [authenticate, authorize([Role.CCM, Role.ADMIN, Role.SUDO])],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await InsurersController.getAll(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  [authenticate, authorize([Role.ADMIN, Role.SUDO])],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await InsurersController.create(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  [authenticate, authorize([Role.ADMIN, Role.SUDO])],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await InsurersController.update(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  [authenticate, authorize([Role.SUDO])],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await InsurersController.delete(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
