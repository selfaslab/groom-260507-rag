import { Router } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { toChunksWithIds } from "../services/chunkService.js";
import { createEmbeddings, createQueryEmbedding } from "../services/openaiService.js";
import { retrieveTopK } from "../services/retrievalService.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
});

export const ragRouter = Router();

ragRouter.post("/chunk", (req, res) => {
  try {
    const text = typeof req.body?.text === "string" ? req.body.text : "";
    const chunkSize =
      typeof req.body?.chunkSize === "number" && req.body.chunkSize > 0
        ? Math.floor(req.body.chunkSize)
        : 300;

    const chunks = toChunksWithIds(text, chunkSize);
    res.json({ chunks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to chunk document";
    res.status(400).json({ error: message });
  }
});

ragRouter.post("/embed", async (req, res) => {
  try {
    const chunks = req.body?.chunks;
    if (!Array.isArray(chunks) || !chunks.every((c) => typeof c === "string")) {
      return res.status(400).json({
        error: "Request body must include `chunks`: string[]",
      });
    }

    const embeddings = await createEmbeddings(chunks);
    res.json({ embeddings });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Embedding request failed";
    const status =
      message.includes("OPENAI_API_KEY") || message.includes("API key")
        ? 503
        : 500;
    res.status(status).json({ error: message });
  }
});

ragRouter.post("/search", async (req, res) => {
  try {
    const query = typeof req.body?.query === "string" ? req.body.query : "";
    const chunksPayload = req.body?.chunks;
    const embeddingsPayload = req.body?.embeddings;
    const topKRaw = req.body?.topK;

    if (!query.trim()) {
      return res.status(400).json({ error: "`query` is required" });
    }

    if (!Array.isArray(chunksPayload) || chunksPayload.length === 0) {
      return res.status(400).json({ error: "`chunks` must be a non-empty array" });
    }

    const chunks = chunksPayload.map((item: unknown, idx: number) => {
      if (
        item &&
        typeof item === "object" &&
        "id" in item &&
        "text" in item &&
        typeof (item as { text: unknown }).text === "string" &&
        typeof (item as { id: unknown }).id === "number"
      ) {
        return {
          id: (item as { id: number }).id,
          text: (item as { text: string }).text,
        };
      }

      throw new Error(`Invalid chunk payload at index ${idx}`);
    });

    if (!Array.isArray(embeddingsPayload)) {
      return res.status(400).json({ error: "`embeddings` must be an array" });
    }

    const embeddings = embeddingsPayload as number[][];
    if (embeddings.length !== chunks.length) {
      return res.status(400).json({
        error: "`chunks` and `embeddings` must have the same length",
      });
    }

    const topK =
      typeof topKRaw === "number" && topKRaw > 0 ? Math.floor(topKRaw) : 5;

    const queryEmbedding = await createQueryEmbedding(query);
    const results = retrieveTopK(queryEmbedding, chunks, embeddings, topK);
    res.json({ results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Search request failed";
    const status =
      message.includes("OPENAI_API_KEY") || message.includes("API key")
        ? 503
        : 500;
    res.status(status).json({ error: message });
  }
});

ragRouter.post("/pdf-text", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const data = await pdfParse(req.file.buffer);
    res.json({
      text:
        typeof (data as { text?: unknown }).text === "string"
          ? (data as { text: string }).text.trim()
          : "",
      pages:
        typeof (data as { numpages?: unknown }).numpages === "number"
          ? (data as { numpages: number }).numpages
          : undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF parsing failed";
    res.status(400).json({ error: message });
  }
});
