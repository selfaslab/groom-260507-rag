import { create } from "zustand";

import type { Chunk, PipelineStep, RetrievalResult } from "../types/rag";

type RagState = {
  document: string;
  chunks: Chunk[];
  embeddings: number[][];
  query: string;
  retrievalResults: RetrievalResult[];
  currentStep: PipelineStep;
  chunkWordSize: number;
  topK: number;
  selectedChunkId: number | null;
  setDocument: (value: string) => void;
  setChunks: (chunks: Chunk[]) => void;
  setEmbeddings: (embeddings: number[][]) => void;
  setQuery: (query: string) => void;
  setRetrievalResults: (results: RetrievalResult[]) => void;
  setCurrentStep: (step: PipelineStep) => void;
  setChunkWordSize: (size: number) => void;
  setTopK: (k: number) => void;
  setSelectedChunkId: (id: number | null) => void;
  resetAfterChunkSizeChange: (chunks: Chunk[]) => void;
  resetPipeline: () => void;
};

export const useRagStore = create<RagState>((set) => ({
  document: "",
  chunks: [],
  embeddings: [],
  query: "",
  retrievalResults: [],
  currentStep: "input",
  chunkWordSize: 300,
  topK: 5,
  selectedChunkId: null,

  setDocument: (document) => set({ document }),
  setChunks: (chunks) => set({ chunks }),
  setEmbeddings: (embeddings) => set({ embeddings }),
  setQuery: (query) => set({ query }),
  setRetrievalResults: (retrievalResults) => set({ retrievalResults }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setChunkWordSize: (chunkWordSize) => set({ chunkWordSize }),
  setTopK: (topK) => set({ topK }),
  setSelectedChunkId: (selectedChunkId) => set({ selectedChunkId }),

  resetAfterChunkSizeChange: (chunks) =>
    set({
      chunks,
      embeddings: [],
      retrievalResults: [],
      selectedChunkId: chunks[0]?.id ?? null,
      currentStep: "chunking",
    }),

  resetPipeline: () =>
    set({
      chunks: [],
      embeddings: [],
      retrievalResults: [],
      selectedChunkId: null,
      currentStep: "input",
    }),
}));
