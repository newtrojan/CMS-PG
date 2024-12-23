import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errors";
import { AuthenticatedRequest } from "../middleware/auth";
import {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "../types/auth";

export class AuthController {
  // ... other methods ...

  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw new AppError(authError.message, 400);

      return ApiResponse.success(
        res,
        {
          user: authData.user,
          token: authData.session?.access_token,
        },
        "Login successful"
      );
    } catch (error) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  }

  // ... other methods ...
}
