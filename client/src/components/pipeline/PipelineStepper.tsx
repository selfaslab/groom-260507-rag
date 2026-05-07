import { motion } from "framer-motion";

import type { PipelineStep } from "../../types/rag";

const STEP_ORDER: PipelineStep[] = [
  "input",
  "chunking",
  "embedding",
  "retrieval",
];

const LABELS: Record<PipelineStep, string> = {
  input: "정보 입력",
  chunking: "청킹",
  embedding: "임베딩",
  retrieval: "검색",
};

type PipelineStepperProps = {
  current: PipelineStep;
};

export function PipelineStepper({ current }: PipelineStepperProps) {
  const activeIndex = STEP_ORDER.indexOf(current);

  return (
    <nav
      aria-label="RAG 파이프라인 단계"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 backdrop-blur-lg sm:px-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {STEP_ORDER.map((step, idx) => {
          const isActive = step === current;
          const isComplete = idx < activeIndex;

          return (
            <div key={step} className="flex min-w-[120px] flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      isActive || isComplete
                        ? "text-indigo-300"
                        : "text-zinc-600"
                    }
                  >
                    {isComplete ? "✓" : `${idx + 1}`}.
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-[0.2em] sm:text-[11px] ${
                      isActive ? "text-indigo-300" : "text-zinc-500"
                    }`}
                  >
                    {LABELS[step]}
                  </span>
                </div>
                <div className="relative h-1 overflow-hidden rounded-full bg-zinc-800">
                  {isActive ? (
                    <motion.span
                      layoutId="pipeline-active"
                      className="absolute inset-y-0 left-0 rounded-full bg-indigo-500"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      style={{ width: "100%" }}
                    />
                  ) : isComplete ? (
                    <span className="block h-full w-full rounded-full bg-emerald-500/70" />
                  ) : (
                    <span className="block h-full w-[18%] rounded-full bg-zinc-700/60" />
                  )}
                </div>
              </div>
              {idx < STEP_ORDER.length - 1 ? (
                <span className="hidden text-zinc-600 md:inline">→</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
