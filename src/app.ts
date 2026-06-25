import express from "express";
import type { Express } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

export const app: Express = express();
app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import routes from "./routes/index.routes";
app.use("/api/v1", routes);
