import type { ChangeEvent } from "react";
import { useRef } from "react";

import { useRagStore } from "../../store/ragStore";
import { Button } from "../ui/Button";
import { ErrorBanner } from "../ui/ErrorBanner";

type DocumentInputProps = {
  onProcess: () => void;
  onPdfPick: (file: File) => void;
  processLoading: boolean;
  pdfLoading: boolean;
  processError: string | null;
  pdfError: string | null;
};

export function DocumentInput({
  onProcess,
  onPdfPick,
  processLoading,
  pdfLoading,
  processError,
  pdfError,
}: DocumentInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { document, setDocument, resetPipeline } = useRagStore();

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPdfPick(file);
    }
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          원문 텍스트
        </label>
        <textarea
          value={document}
          onChange={(e) => {
            setDocument(e.target.value);
            if (!e.target.value.trim()) {
              resetPipeline();
            }
          }}
          placeholder="RAG로 다룰 문서를 붙여 넣거나 PDF를 업로드하세요."
          className="mt-2 min-h-[180px] w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {(processError || pdfError) && (
        <ErrorBanner message={processError ?? pdfError ?? ""} />
      )}

      <div className="flex flex-wrap gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          variant="ghost"
          type="button"
          loading={pdfLoading}
          onClick={() => fileRef.current?.click()}
        >
          PDF 업로드 (선택)
        </Button>
        <Button
          type="button"
          loading={processLoading}
          disabled={!document.trim()}
          onClick={onProcess}
        >
          Process · 청킹 요청
        </Button>
      </div>
    </div>
  );
}
