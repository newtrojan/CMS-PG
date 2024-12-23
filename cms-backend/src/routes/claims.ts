import express from "express";
import {
  getClaims,
  getClaim,
  createClaim,
  updateClaim,
  deleteClaim,
  addPartToClaim,
  uploadDocument,
} from "../controllers/claims.controller";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();

/**
 * @swagger
 * /api/claims:
 *   get:
 *     summary: Get all claims with pagination
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of claims
 */
router.get("/", authenticate, asyncHandler(getClaims));

/**
 * @swagger
 * /api/claims/{id}:
 *   get:
 *     summary: Get a single claim by ID
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Claim details
 *       404:
 *         description: Claim not found
 */
router.get("/:id", authenticate, asyncHandler(getClaim));

/**
 * @swagger
 * /api/claims:
 *   post:
 *     summary: Create a new claim
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - claimNumber
 *               - vehicleInfo
 *             properties:
 *               claimNumber:
 *                 type: string
 *               vehicleInfo:
 *                 type: object
 *     responses:
 *       201:
 *         description: Claim created successfully
 */
router.post("/", authenticate, asyncHandler(createClaim));

/**
 * @swagger
 * /api/claims/{id}:
 *   put:
 *     summary: Update a claim
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Claim updated successfully
 *       404:
 *         description: Claim not found
 */
router.put("/:id", authenticate, asyncHandler(updateClaim));

/**
 * @swagger
 * /api/claims/{id}:
 *   delete:
 *     summary: Delete a claim
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Claim deleted successfully
 *       404:
 *         description: Claim not found
 */
router.delete("/:id", authenticate, asyncHandler(deleteClaim));

/**
 * @swagger
 * /api/claims/{id}/parts:
 *   post:
 *     summary: Add a part to a claim
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - partNumber
 *               - description
 *               - quantity
 *               - unitPrice
 *             properties:
 *               partNumber:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unitPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Part added successfully
 */
router.post("/:id/parts", authenticate, asyncHandler(addPartToClaim));

/**
 * @swagger
 * /api/claims/{id}/documents:
 *   post:
 *     summary: Upload a document to a claim
 *     tags: [Claims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 */
router.post("/:id/documents", authenticate, asyncHandler(uploadDocument));

export default router;
