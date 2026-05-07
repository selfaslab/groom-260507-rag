import { motion } from "framer-motion";

import { useRagStore } from "../../store/ragStore";
import { EmptyState } from "../ui/EmptyState";

export function RetrievalResults() {
  const { retrievalResults } = useRagStore();

  if (!retrievalResults.length) {
    return (
      <EmptyState
        title="검색 결과가 여기 표시됩니다"
        description="임베딩을 생성한 뒤 질문을 입력하고 검색을 실행하세요."
      />
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {retrievalResults.map((hit, idx) => (
        <motion.li
          key={`${hit.chunkId}-${idx}`}
          animate={{ scale: [1, 1.01, 1] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: idx * 0.2,
          }}
          className="rounded-2xl border border-cyan-500/40 bg-cyan-500/5 p-4"
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-sm font-semibold text-white">
              {idx + 1}. Chunk #{hit.chunkId}
            </span>
            <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-semibold text-cyan-200">
              cos θ · {hit.score.toFixed(3)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-200">
            {hit.text.length > 280 ? `${hit.text.slice(0, 280)}…` : hit.text}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
