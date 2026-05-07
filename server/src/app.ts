import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ragRouter } from "./routes/ragRoutes.js";

export function createApp(): express.Application {
  dotenv.config({
    path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
    override: true,
  });

  const app = express();

  app.use(
    cors({
      origin: true,
      methods: ["GET", "POST", "OPTIONS"],
    }),
  );

  app.use(express.json({ limit: "10mb" }));

  app.get("/", (_req, res) => {
    res.type("text/plain").send("RAG API server is running. Use /api/health");
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      openAiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    });
  });

  app.use("/api", ragRouter);

  return app;
}
