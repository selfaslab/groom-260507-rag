# RAG Pipeline Visualizer

교육/포트폴리오용 RAG 단계별 시각화 웹앱입니다. 문서 입력 → 단어 단위 청킹 → OpenAI 임베딩 → 코사인 유사도 Top‑K 검색 → 프롬프트 구성까지 한 화면에서 확인합니다.

## 스택

- **클라이언트**: React, Vite, TypeScript, Tailwind CSS v4, Zustand, TanStack Query, Framer Motion, Recharts  
- **서버**: Node.js, Express, OpenAI Embeddings (`text-embedding-3-small`), pdf-parse  

OpenAI 호출은 **서버에서만** 수행됩니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install --prefix server
npm install --prefix client
npm install
```

마지막 명령은 루트의 `concurrently`용 선택 항목입니다.

### 2. 환경 변수

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`server/.env`:

- `OPENAI_API_KEY`: OpenAI API 키 (필수 — 임베딩/검색에 사용)
- `PORT`: 기본 `5000`

`client/.env`:

- `VITE_API_URL`: API 베이스 URL (예: `http://localhost:5000`)  
  미설정 시 Vite 개발 서버 프록시로 `/api`를 `localhost:5000`에 전달합니다.

### 3. 개발 실행

별도 두 터미널:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

또는 루트에서:

```bash
npm install
npm run dev
```

클라이언트 기본 포트는 `5173`입니다.

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/chunk` | 본문 `{ text, chunkSize? }` → 청크 배열 |
| `POST` | `/api/embed` | `{ chunks: string[] }` → 임베딩 배열 |
| `POST` | `/api/search` | `{ query, chunks, embeddings, topK? }` → Top‑K 결과 |
| `POST` | `/api/pdf-text` | `multipart/form-data` 파일 필드 `file` → 텍스트 |
| `GET` | `/api/health` | 서버 상태 및 키 설정 여부 |

## 프로덕션 빌드

```bash
npm run build --prefix client
npm run build --prefix server
node server/dist/index.js
```

프로덕션에서는 클라이언트의 `VITE_API_URL`을 실제 배포 도메인에 맞춥니다.
