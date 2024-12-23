// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors";
import { config } from "../config/app";
import { Role } from "../config/auth";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
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

    const decoded = jwt.verify(token, config.jwt.secret!) as {
      id: string;
      email: string;
      role: Role;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
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
