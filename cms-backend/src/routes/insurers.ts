import express from "express";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../config/supabase";
import {
  createInsurer,
  getInsurers,
  getInsurer,
  updateInsurer,
  deleteInsurer,
} from "../controllers/insurers.controller";

const router = express.Router();

// Only CCM, ADMIN, and SUDO roles can access these routes
const authorizedRoles = [UserRole.CCM, UserRole.ADMIN, UserRole.SUDO];

router.post("/", authenticate, authorize(...authorizedRoles), createInsurer);
router.get("/", authenticate, authorize(...authorizedRoles), getInsurers);
router.get("/:id", authenticate, authorize(...authorizedRoles), getInsurer);
router.put("/:id", authenticate, authorize(...authorizedRoles), updateInsurer);
router.delete(
  "/:id",
  authenticate,
  authorize(...authorizedRoles),
  deleteInsurer
);

export default router;
