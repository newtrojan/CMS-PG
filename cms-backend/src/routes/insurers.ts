import { Router } from "express";
import { InsurersController } from "../controllers/insurers.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { Role } from "../config/auth";

const router = Router();

router
  .route("/")
  .get(
    authenticate,
    authorize([Role.CCM, Role.ADMIN, Role.SUDO]),
    InsurersController.getAll
  )
  .post(
    authenticate,
    authorize([Role.ADMIN, Role.SUDO]),
    InsurersController.create
  );

router
  .route("/:id")
  .put(
    authenticate,
    authorize([Role.ADMIN, Role.SUDO]),
    InsurersController.update
  )
  .delete(authenticate, authorize([Role.SUDO]), InsurersController.delete);

export default router;
