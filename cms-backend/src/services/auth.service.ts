import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors";
import { config } from "../config/app";

const prisma = new PrismaClient();

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwt.secret!,
      { expiresIn: config.jwt.expiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; phone?: string }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
