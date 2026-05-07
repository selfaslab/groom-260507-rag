import { createApp } from "./app.js";

const app = createApp();
const PORT = Number(process.env.PORT ?? 5000);

app.listen(PORT, () => {
  console.log(`RAG API listening on http://localhost:${PORT}`);
});
