import { postEmbed } from "./api";

/**
 * Embedding round-trip helpers (항상 서버 OpenAI 호출만 사용합니다).
 */
export const embeddingService = {
  embedMany: (chunks: string[]) => postEmbed(chunks),
};
