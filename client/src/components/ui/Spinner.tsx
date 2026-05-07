export function Spinner({ label }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-10 text-zinc-400"
    >
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      <span className="text-sm">{label ?? "불러오는 중입니다..."}</span>
    </div>
  );
}
