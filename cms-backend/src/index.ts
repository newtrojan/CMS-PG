// src/index.ts
import "./instrument"; // Must be first import
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/app";
import { setupDocs } from "./middleware/docs";
import authRoutes from "./routes/auth";
import insurersRoutes from "./routes/insurers";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Basic middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes with versioning
const apiRouter = express.Router();
app.use("/api/v1", apiRouter);

// Setup API documentation
setupDocs(app);

// Mount routes on versioned API router
apiRouter.use("/auth", authRoutes);
apiRouter.use("/insurers", insurersRoutes);

// Basic health check route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    environment: config.app.env,
  });
});

// Error handler must be registered after all controllers
app.use(errorHandler);

// Start server
const server = app.listen(config.app.port, () => {
  console.log(
    `🚀 Server running on port ${config.app.port} in ${config.app.env} mode`
  );
});

export default server;
