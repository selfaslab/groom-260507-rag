import { motion } from "framer-motion";

import { useRagStore } from "../../store/ragStore";
import { EmptyState } from "../ui/EmptyState";

export function ChunkList() {
  const { chunks, selectedChunkId, setSelectedChunkId } = useRagStore();

  if (!chunks.length) {
    return (
      <EmptyState
        title="청크가 아직 없습니다"
        description="문서를 입력하고 Process를 눌러 서버 청킹 결과를 받아오세요."
      />
    );
  }

  return (
    <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
      {chunks.map((chunk, idx) => {
        const active = chunk.id === selectedChunkId;

        return (
          <motion.button
            type="button"
            key={chunk.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.35, ease: "easeOut" }}
            onClick={() => setSelectedChunkId(chunk.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              active
                ? "border-indigo-500/80 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Chunk #{chunk.id}
            </p>
            <hr className="my-3 border-zinc-800/80" />
            <p className="text-sm leading-relaxed text-zinc-200">
              {chunk.text.length > 220
                ? `${chunk.text.slice(0, 220)}…`
                : chunk.text}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
