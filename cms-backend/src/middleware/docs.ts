// src/middleware/docs.ts
import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "../config/swagger";
import swaggerJsdoc from "swagger-jsdoc";

export const setupDocs = (app: Express) => {
  // Swagger documentation route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  // JSON version of documentation
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "CMS API Documentation",
        version: "1.0.0",
        description: "Claims Management System API",
      },
      servers: [
        {
          url: "/api/v1",
          description: "API v1",
        },
      ],
      // ... rest of your swagger config
    },
    apis: ["./src/routes/*.ts"],
  };
};
