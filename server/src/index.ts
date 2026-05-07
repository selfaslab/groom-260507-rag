import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ragRouter } from "./routes/ragRoutes.js";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
  override: true,
});

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

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

app.listen(PORT, () => {
  console.log(`RAG API listening on http://localhost:${PORT}`);
});
