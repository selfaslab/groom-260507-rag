import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-6 shadow-xl shadow-black/30 backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}
