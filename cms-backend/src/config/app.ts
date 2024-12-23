// src/config/app.ts
import dotenv from "dotenv";
import path from "path";

// Load environment-specific .env file
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
  app: {
    name: "CMS Backend",
    port: process.env.PORT || 5001,
    env: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    enabled: process.env.NODE_ENV === "production",
  },
  admin: {
    email: process.env.SUDO_EMAIL,
    password: process.env.SUDO_PASSWORD,
  },
};
