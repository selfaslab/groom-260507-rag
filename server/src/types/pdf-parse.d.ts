declare module "pdf-parse" {
  import type { Buffer } from "node:buffer";

  export default function pdfParse(
    buffer: Buffer,
  ): Promise<{ text: string; numpages?: number }>;
}
