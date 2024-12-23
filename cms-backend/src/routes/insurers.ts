import { Router } from "express";
import { InsurersController } from "../controllers/insurers.controller";
import { authenticate, authorize } from "../middleware/auth";
import { Role } from "../config/auth";

const router = Router();

/**
 * @swagger
 * /insurers:
 *   get:
 *     summary: Get all insurers
 *     tags: [Insurers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of insurers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get(
  "/",
  authenticate,
  authorize(Role.CCM, Role.ADMIN, Role.SUDO),
  InsurersController.getAll
);

/**
 * @swagger
 * /insurers:
 *   post:
 *     summary: Create a new insurer
 *     tags: [Insurers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - billingEmail
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               billingEmail:
 *                 type: string
 *               carrierNote:
 *                 type: string
 *     responses:
 *       201:
 *         description: Insurer created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.SUDO),
  InsurersController.create
);

/**
 * @swagger
 * /insurers/{id}:
 *   put:
 *     summary: Update an insurer
 *     tags: [Insurers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.SUDO),
  InsurersController.update
);

/**
 * @swagger
 * /insurers/{id}:
 *   delete:
 *     summary: Delete an insurer
 *     tags: [Insurers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete(
  "/:id",
  authenticate,
  authorize(Role.SUDO),
  InsurersController.delete
);

export default router;
