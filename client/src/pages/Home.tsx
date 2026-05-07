import { useEffect } from "react";

import { ChunkList } from "../components/chunking/ChunkList";
import { ChunkSizeSlider } from "../components/chunking/ChunkSizeSlider";
import { DocumentInput } from "../components/chunking/DocumentInput";
import { EmbeddingDimensionsChart } from "../components/embedding/EmbeddingDimensionsChart";
import { EmbeddingPreview } from "../components/embedding/EmbeddingPreview";
import { PipelineStepper } from "../components/pipeline/PipelineStepper";
import { PromptViewer } from "../components/prompt/PromptViewer";
import { QueryPanel } from "../components/retrieval/QueryPanel";
import { RetrievalResults } from "../components/retrieval/RetrievalResults";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { useRagPipeline } from "../hooks/useRagPipeline";
import { useRagStore } from "../store/ragStore";

export function Home() {
  const currentStep = useRagStore((s) => s.currentStep);
  const chunks = useRagStore((s) => s.chunks);
  const embeddings = useRagStore((s) => s.embeddings);
  const selectedChunkId = useRagStore((s) => s.selectedChunkId);
  const chunkWordSize = useRagStore((s) => s.chunkWordSize);
  const topK = useRagStore((s) => s.topK);

  const {
    healthQuery,
    chunkMutation,
    embedMutation,
    searchMutation,
    pdfMutation,
    applyChunkSizeLocally,
  } = useRagPipeline();

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const { document, chunks } = useRagStore.getState();
      if (!document.trim() || chunks.length === 0) {
        return;
      }
      applyChunkSizeLocally();
    }, 350);

    return () => window.clearTimeout(handle);
  }, [chunkWordSize, applyChunkSizeLocally]);

  const backendOk = healthQuery.data?.ok;
  const apiReady =
    backendOk === undefined
      ? "확인 중"
      : backendOk
        ? "서버 연결됨"
        : "헬스체크 실패";

  const openAiReady =
    healthQuery.data?.openAiConfigured === undefined
      ? ""
      : healthQuery.data?.openAiConfigured
        ? "OpenAI 준비됨"
        : "OPENAI_API_KEY 필요";

  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),transparent_52%)] pb-14">
      <header className="border-b border-zinc-900/70 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
              RAG 교육용 MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              RAG Pipeline Visualizer
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              입력 → 단어 단위 청킹 → OpenAI Embeddings → 코사인 Top-K 검색 → 프롬프트
              구성까지 한 화면에서 추적합니다. OpenAI 키는 항상 서버에서만
              사용됩니다.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs text-zinc-400">
            {healthQuery.isLoading ? (
              <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                <span className="h-3 w-3 animate-spin rounded-full border border-emerald-400 border-t-transparent" />
                헬스체크 중...
              </span>
            ) : healthQuery.error ? (
              <ErrorBanner
                message={(healthQuery.error as Error).message}
              />
            ) : (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-emerald-200">
                  ● {apiReady}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-indigo-200">
                  ● {openAiReady}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-8">
          <PipelineStepper current={currentStep} />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="flex flex-col gap-8 lg:sticky lg:top-6 lg:h-fit lg:max-h-[calc(100vh-140px)]">
          <DocumentInput
            processLoading={chunkMutation.isPending}
            pdfLoading={pdfMutation.isPending}
            processError={
              chunkMutation.isError ? (chunkMutation.error as Error).message : null
            }
            pdfError={
              pdfMutation.isError ? (pdfMutation.error as Error).message : null
            }
            onProcess={() => chunkMutation.mutate()}
            onPdfPick={(file) => pdfMutation.mutate(file)}
          />

          <div>
            <h2 className="text-lg font-semibold text-white">청킹 결과</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Chunk 카드 선택 → 오른쪽 임베딩 패널에 반영
            </p>
            <div className="mt-6 space-y-5">
              <ChunkSizeSlider disabled={!chunks.length} />
              <ChunkList />
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8">
            <h2 className="text-lg font-semibold text-white">질의</h2>
            <QueryPanel
              loading={searchMutation.isPending}
              error={
                searchMutation.isError
                  ? (searchMutation.error as Error).message
                  : null
              }
              disabledReason={
                embeddings.length === 0
                  ? "먼저 임베딩을 생성하세요."
                  : null
              }
              onSearch={() => searchMutation.mutate()}
            />
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">임베딩</h2>
                <p className="text-xs text-zinc-500">
                  서버에서 <code className="text-indigo-200">text-embedding-3-small</code>
                  호출 · 벡터는 일부만 표시
                </p>
              </div>
              <Button
                onClick={() => embedMutation.mutate()}
                loading={embedMutation.isPending}
                disabled={!chunks.length}
              >
                임베딩 생성
              </Button>
            </div>

            {embedMutation.isError ? (
              <ErrorBanner message={(embedMutation.error as Error).message} />
            ) : null}

            {!chunks.length ? (
              <EmptyState title="먼저 청크를 만들어 주세요" />
            ) : !embeddings.length ? (
              <EmptyState
                title="아직 벡터가 없습니다"
                description="청크 준비가 끝나면 버튼을 눌러 OpenAI Embedding을 생성합니다."
              />
            ) : (
              <>
                <EmbeddingPreview
                  vectors={embeddings}
                  chunks={chunks}
                  selectedChunkId={selectedChunkId}
                />
                <EmbeddingDimensionsChart
                  vectors={embeddings}
                  chunks={chunks}
                  selectedChunkId={selectedChunkId}
                />
              </>
            )}
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">검색</h2>
                <p className="text-xs text-zinc-500">
                  코사인 유사도 순으로 Top-{topK} 결과
                </p>
              </div>
            </div>
            <RetrievalResults />
          </Card>

          <Card>
            <PromptViewer />
          </Card>
        </div>
      </main>
    </div>
  );
}
