export function chunkText(text: string, chunkSize = 300): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

export function chunksToEntities(text: string, chunkSize: number) {
  return chunkText(text, chunkSize).map((chunkBody, idx) => ({
    id: idx + 1,
    text: chunkBody,
  }));
}
