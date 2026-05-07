import OpenAI from "openai";

function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    throw new Error("OPENAI_API_KEY is not set on the server");
  }
  return new OpenAI({ apiKey: key });
}

export async function createEmbeddings(inputs: string[]): Promise<number[][]> {
  if (inputs.length === 0) {
    return [];
  }

  const openai = getClient();
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: inputs,
  });

  return response.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding as number[]);
}

export async function createQueryEmbedding(query: string): Promise<number[]> {
  const vectors = await createEmbeddings([query]);
  return vectors[0] ?? [];
}
