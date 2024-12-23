// src/routes/auth.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth";
import { Role } from "../config/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/register",
  authenticate,
  authorize(Role.ADMIN, Role.SUDO),
  AuthController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout from the application
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post("/logout", authenticate, AuthController.logout);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", authenticate, AuthController.getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 */
router.put("/profile", authenticate, AuthController.updateProfile);

router.get("/test-db", async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ success: true, userCount: count });
  } catch (error) {
    console.error("Database test error:", error);
    res
      .status(500)
      .json({ success: false, error: "Database connection failed" });
  }
});

export default router;
