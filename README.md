
# RAG Pipeline Visualizer

교육/포트폴리오용 RAG 단계별 시각화 웹앱입니다. 문서 입력 → 단어 단위 청킹 → OpenAI 임베딩 → 코사인 유사도 Top‑K 검색 → 프롬프트 구성까지 한 화면에서 확인합니다.

<img width="967" height="871" alt="rag1" src="https://github.com/user-attachments/assets/a9d1280b-7897-43b2-8def-4c959e3f0638" />

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

<img width="870" height="871" alt="rag2" src="https://github.com/user-attachments/assets/1e3d2c60-72c4-4686-8541-0804d01f47d6" />

## 프로덕션 빌드

```bash
npm run build --prefix client
npm run build --prefix server
node server/dist/index.js
```

프로덕션에서는 클라이언트의 `VITE_API_URL`을 실제 배포 도메인에 맞춥니다.

## Vercel 배포

리포지토리 루트에 `vercel.json`과 `api/index.ts`가 있어, **프런트(Vite 빌드) + Express API(서버리스)** 형태로 한 프로젝트에 올릴 수 있습니다.

- **프로덕션 빌드**: `client/dist` 출력, `/api/*`는 `api/index.ts`의 Express 앱으로 전달됩니다.
- **브라우저 호출 주소**: `client/.env.production`에서 `VITE_API_URL`을 비워 두어 같은 호스트의 `/api`를 쓰도록 했습니다.
- **환경 변수 (Vercel 대시보드 → Project → Settings → Environment Variables)**  
  - `OPENAI_API_KEY`: 필수 (임베딩·검색)
- 로컬에서 배포하려면: `npx vercel deploy --prod` (또는 GitHub 연동 후 자동 배포)

GitHub와 Vercel 계정을 연결하지 않으면 CLI에서 “Login Connection” 오류가 날 수 있습니다. [Vercel 계정에 GitHub 연결](https://vercel.com/docs/accounts/create-an-account#login-methods-and-connections) 후 다시 연동하세요.
