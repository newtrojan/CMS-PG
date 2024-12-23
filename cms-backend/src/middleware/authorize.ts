import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { Role } from "@prisma/client";
import { ApiResponse } from "../utils/apiResponse";

export const authorize = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.error(res, "Unauthorized", 401);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(res, "Forbidden", 403);
    }

    next();
  };
};
