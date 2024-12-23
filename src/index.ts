import express from "express";
import cors from "cors";
import { config } from "./config/app";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", routes);

app.listen(config.app.port, () => {
  console.log(
    `🚀 Server running on port ${config.app.port} in ${config.app.env} mode`
  );
});
