import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { Role } from "../config/auth";
import { AppError } from "../utils/errors";

export const authorize = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized - No user found", 401);
      }

      const hasPermission = allowedRoles.includes(req.user.role);

      if (!hasPermission) {
        throw new AppError("Forbidden - Insufficient permissions", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
