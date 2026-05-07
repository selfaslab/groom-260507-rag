import { cosineSimilarity } from "../utils/cosineSimilarity.js";

export type ChunkPayload = { id: number; text: string };

export type SearchHit = {
  chunkId: number;
  score: number;
  text: string;
};

export function retrieveTopK(
  queryEmbedding: number[],
  chunks: ChunkPayload[],
  embeddings: number[][],
  topK: number,
): SearchHit[] {
  if (!queryEmbedding.length || chunks.length !== embeddings.length) {
    return [];
  }

  const safeK = Math.max(1, Math.min(topK, chunks.length));

  const ranked = embeddings.map((embedding, idx) => {
    const chunk = chunks[idx];
    if (!chunk) {
      return null;
    }
    return {
      chunkId: chunk.id,
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, embedding),
    };
  }).filter(Boolean) as SearchHit[];

  return ranked.sort((a, b) => b.score - a.score).slice(0, safeK);
}
