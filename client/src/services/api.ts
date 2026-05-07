import type { ApiHealth, Chunk, RetrievalResult } from "../types/rag";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

function url(path: string) {
  return `${API_URL}${path}`;
}

async function readError(res: Response): Promise<string> {
  const raw = await res.text();
  try {
    const data = JSON.parse(raw) as { error?: string };
    if (data.error && typeof data.error === "string") {
      return data.error;
    }
  } catch {
    /* plain text body */
  }
  return raw || `요청 실패 (${res.status})`;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(await readError(res));
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export async function getHealth(): Promise<ApiHealth> {
  const res = await fetch(url("/api/health"));
  return parseJson<ApiHealth>(res);
}

export type ChunkResponse = {
  chunks: Chunk[];
};

export async function postChunk(payload: {
  text: string;
  chunkSize: number;
}): Promise<ChunkResponse> {
  const res = await fetch(url("/api/chunk"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: payload.text, chunkSize: payload.chunkSize }),
  });
  return parseJson<ChunkResponse>(res);
}

export type EmbedResponse = {
  embeddings: number[][];
};

export async function postEmbed(chunks: string[]): Promise<EmbedResponse> {
  const res = await fetch(url("/api/embed"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chunks }),
  });
  return parseJson<EmbedResponse>(res);
}

export type SearchPayload = {
  query: string;
  chunks: Chunk[];
  embeddings: number[][];
  topK: number;
};

export type SearchResponse = {
  results: RetrievalResult[];
};

export async function postSearch(
  payload: SearchPayload,
): Promise<SearchResponse> {
  const res = await fetch(url("/api/search"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<SearchResponse>(res);
}

export async function postPdfExtract(file: File): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url("/api/pdf-text"), {
    method: "POST",
    body: formData,
  });

  return parseJson<{ text: string }>(res);
}
