import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Chunk } from "../../types/rag";

type EmbeddingDimensionsChartProps = {
  vectors: number[][];
  chunks: Chunk[];
  selectedChunkId: number | null;
};

const SLICE = 24;

export function EmbeddingDimensionsChart({
  vectors,
  chunks,
  selectedChunkId,
}: EmbeddingDimensionsChartProps) {
  if (!vectors.length || !chunks.length) {
    return null;
  }

  const idx = chunks.findIndex((c) => c.id === selectedChunkId);
  const safeIndex = idx >= 0 ? idx : 0;
  const row = vectors[safeIndex];
  if (!row?.length) {
    return null;
  }

  const data = row.slice(0, SLICE).map((value, dim) => ({
    dim: `${dim}`,
    value,
  }));

  return (
    <div className="mt-6 h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="dim" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
          <YAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} width={32} />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            contentStyle={{
              background: "#09090b",
              borderRadius: "12px",
              borderColor: "#3f3f46",
              color: "#f4f4f5",
            }}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-[11px] text-zinc-500">
        선택된 청크의 앞쪽 {Math.min(SLICE, row.length)}개 차원
      </p>
    </div>
  );
}
