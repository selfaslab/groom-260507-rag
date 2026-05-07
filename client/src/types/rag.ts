export type PipelineStep = "input" | "chunking" | "embedding" | "retrieval";

export type Chunk = {
  id: number;
  text: string;
};

export type RetrievalResult = {
  chunkId: number;
  score: number;
  text: string;
};

export type ApiHealth = {
  ok: boolean;
  openAiConfigured: boolean;
};
