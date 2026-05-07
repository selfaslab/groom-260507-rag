import { useRagStore } from "../../store/ragStore";
import { Button } from "../ui/Button";

type QueryPanelProps = {
  onSearch: () => void;
  loading: boolean;
  disabledReason?: string | null;
  error?: string | null;
};

export function QueryPanel({
  onSearch,
  loading,
  disabledReason,
  error,
}: QueryPanelProps) {
  const { query, topK, setQuery, setTopK, embeddings } = useRagStore();

  const canSearch = embeddings.length > 0 && query.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        질문 (Query)
      </label>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="예: RAG의 핵심 구조는 무엇인가요?"
        className="min-h-[100px] w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-wide text-zinc-400">
          Top-K
          <input
            type="number"
            min={1}
            max={20}
            value={topK}
            onChange={(e) =>
              setTopK(Math.min(20, Math.max(1, Number(e.target.value) || 1)))
            }
            className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      {disabledReason ? (
        <p className="text-xs text-amber-300/90">{disabledReason}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-red-300">{error}</p>
      ) : null}

      <Button
        type="button"
        variant="ghost"
        className="border-cyan-500/40 text-cyan-200 hover:border-cyan-400 hover:bg-cyan-500/5"
        loading={loading}
        disabled={!canSearch}
        onClick={onSearch}
      >
        코사인 유사도 검색 실행
      </Button>
    </div>
  );
}
