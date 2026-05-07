type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-10 text-center text-zinc-500">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {description ? (
        <p className="max-w-md text-xs text-zinc-500">{description}</p>
      ) : null}
    </div>
  );
}
