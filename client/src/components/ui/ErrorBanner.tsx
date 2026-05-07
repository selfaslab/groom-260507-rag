type ErrorBannerProps = {
  message: string;
  onDismiss?: () => void;
};

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-red-900/60 bg-red-950/50 px-4 py-3 text-sm text-red-100">
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          className="text-xs uppercase tracking-wide text-red-300 hover:text-white"
          onClick={onDismiss}
        >
          닫기
        </button>
      ) : null}
    </div>
  );
}
