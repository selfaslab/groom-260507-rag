import { useRagStore } from "../../store/ragStore";

type ChunkSizeSliderProps = {
  disabled?: boolean;
};

export function ChunkSizeSlider({ disabled }: ChunkSizeSliderProps) {
  const { chunkWordSize, setChunkWordSize } = useRagStore();

  return (
    <div className={`flex flex-col gap-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
        <span>Chunk 크기 (단어 수)</span>
        <span className="tabular-nums text-indigo-300">{chunkWordSize}</span>
      </div>
      <input
        type="range"
        min={20}
        max={600}
        step={10}
        disabled={disabled}
        value={chunkWordSize}
        onChange={(e) => setChunkWordSize(Number(e.target.value))}
        className="accent-indigo-500 disabled:cursor-not-allowed"
      />
      <p className="text-xs text-zinc-500">
        슬라이더를 놓으면 동일 규칙으로 클라이언트에서 즉시 재청킹됩니다 (임베딩은
        초기화).
      </p>
    </div>
  );
}
