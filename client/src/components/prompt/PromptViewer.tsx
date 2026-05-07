import { useMemo } from "react";

import { useRagStore } from "../../store/ragStore";
import { buildRagPrompt } from "../../utils/buildRagPrompt";

export function PromptViewer() {
  const { query, retrievalResults } = useRagStore();

  const prompt = useMemo(
    () => buildRagPrompt(query, retrievalResults),
    [query, retrievalResults],
  );

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Prompt Viewer
        </p>
        <p className="text-xs text-zinc-500">
          LLM에 그대로 붙여 넣을 수 있는 최종 프롬프트 초안입니다.
        </p>
      </div>
      <pre className="max-h-[320px] overflow-auto rounded-2xl border border-zinc-800 bg-black/50 p-4 text-left text-xs leading-relaxed text-zinc-200">
        {prompt}
      </pre>
    </div>
  );
}
