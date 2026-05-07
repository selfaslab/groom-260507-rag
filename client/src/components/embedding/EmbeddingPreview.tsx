import { useMemo } from "react";

import type { Chunk } from "../../types/rag";

type EmbeddingPreviewProps = {
  vectors: number[][];
  chunks: Chunk[];
  selectedChunkId: number | null;
};

export function EmbeddingPreview({
  vectors,
  chunks,
  selectedChunkId,
}: EmbeddingPreviewProps) {
  const vector = useMemo(() => {
    if (!vectors.length || !chunks.length) {
      return [];
    }

    const index = chunks.findIndex((c) => c.id === selectedChunkId);
    const safeIndex = index >= 0 ? index : 0;
    return vectors[safeIndex] ?? [];
  }, [chunks, selectedChunkId, vectors]);

  if (!vector.length) {
    return null;
  }

  const previewLen = Math.min(12, vector.length);
  const head = vector.slice(0, previewLen);

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        벡터 앞쪽 {previewLen}차원
      </p>
      <pre className="mt-2 overflow-x-auto rounded-xl border border-zinc-800 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-emerald-200">
        [{head.map((n) => n.toFixed(3)).join(", ")}, …]
      </pre>
    </div>
  );
}
