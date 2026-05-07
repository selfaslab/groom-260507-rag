import type { Chunk } from "../types/rag";
import {
  postChunk,
  postEmbed,
  postPdfExtract,
  postSearch,
} from "./api";

export async function fetchChunksFromServer(
  text: string,
  chunkSize: number,
) {
  return postChunk({ text, chunkSize });
}

export async function embedChunkTexts(chunkTexts: string[]) {
  return postEmbed(chunkTexts);
}

export async function runSemanticSearch(payload: {
  query: string;
  chunks: Chunk[];
  embeddings: number[][];
  topK: number;
}) {
  return postSearch(payload);
}

export async function extractPdfToText(file: File) {
  return postPdfExtract(file);
}
