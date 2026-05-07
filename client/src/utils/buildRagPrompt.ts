import type { RetrievalResult } from "../types/rag";

export function buildRagPrompt(query: string, results: RetrievalResult[]) {
  const contextBlocks = results
    .map(
      (hit, idx) =>
        `[#${idx + 1}] (chunk ${hit.chunkId}, score ${hit.score.toFixed(4)})\n${hit.text}`,
    )
    .join("\n\n---\n\n");

  const header =
    "You are a careful assistant. Answer using only the provided context. If the context is insufficient, say so briefly.";

  return `${header}\n\nContext:\n${contextBlocks || "(no retrieval results yet)"}\n\nQuestion:\n${query || "(질문을 입력해 주세요)"}\n`;
}
