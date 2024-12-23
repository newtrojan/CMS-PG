// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors";
import { config } from "../config/app";
import { Role } from "../config/auth";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError("No authentication token provided", 401);
    }

    console.log("JWT Secret:", config.jwt.secret);
    console.log("Token:", token);

    try {
      const decoded = jwt.verify(token, config.jwt.secret!) as {
        userId: string;
        role: Role;
        iat: number;
        exp: number;
        email: string;
      };

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      };

      next();
    } catch (jwtError) {
      console.error("JWT Verification Error:", jwtError);
      throw new AppError("Invalid or expired token", 401);
    }
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError("Authentication error", 401)
    );
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError("Insufficient permissions", 403);
    }
    next();
  };
};
