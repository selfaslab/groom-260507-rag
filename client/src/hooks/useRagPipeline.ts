import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { getHealth } from "../services/api";
import {
  embedChunkTexts,
  extractPdfToText,
  fetchChunksFromServer,
  runSemanticSearch,
} from "../services/ragService";
import { useRagStore } from "../store/ragStore";
import { chunksToEntities } from "../utils/chunkText";

const queryClient = {
  health: ["api", "health"] as const,
};

export function useRagPipeline() {
  const {
    document,
    chunkWordSize,
    setChunks,
    setEmbeddings,
    setRetrievalResults,
    setCurrentStep,
    setSelectedChunkId,
    resetAfterChunkSizeChange,
    resetPipeline,
    setDocument,
  } = useRagStore();

  const healthQuery = useQuery({
    queryKey: queryClient.health,
    queryFn: getHealth,
    staleTime: 30_000,
    retry: 1,
  });

  const chunkMutation = useMutation({
    mutationFn: async () => {
      const latest = useRagStore.getState();
      return fetchChunksFromServer(latest.document, latest.chunkWordSize);
    },
    onSuccess: (data) => {
      setChunks(data.chunks);
      setEmbeddings([]);
      setRetrievalResults([]);
      setSelectedChunkId(data.chunks[0]?.id ?? null);
      setCurrentStep("chunking");
    },
  });

  const embedMutation = useMutation({
    mutationFn: async () => {
      const texts = useRagStore.getState().chunks.map((c) => c.text);
      return embedChunkTexts(texts);
    },
    onSuccess: (data) => {
      setEmbeddings(data.embeddings);
      setRetrievalResults([]);
      setCurrentStep("embedding");
    },
  });

  const searchMutation = useMutation({
    mutationFn: async () => {
      const latest = useRagStore.getState();
      return runSemanticSearch({
        query: latest.query,
        chunks: latest.chunks,
        embeddings: latest.embeddings,
        topK: latest.topK,
      });
    },
    onSuccess: (data) => {
      setRetrievalResults(data.results);
      setCurrentStep("retrieval");
    },
  });

  const pdfMutation = useMutation({
    mutationFn: async (file: File) => extractPdfToText(file),
    onSuccess: (data) => {
      setDocument(data.text ?? "");
      resetPipeline();
      setCurrentStep("input");
    },
  });

  const applyChunkSizeLocally = useCallback(() => {
    if (!document.trim()) {
      return;
    }

    resetAfterChunkSizeChange(chunksToEntities(document, chunkWordSize));
  }, [
    chunkWordSize,
    document,
    resetAfterChunkSizeChange,
  ]);

  return {
    healthQuery,
    chunkMutation,
    embedMutation,
    searchMutation,
    pdfMutation,
    applyChunkSizeLocally,
  };
}
