# Architecture — OpsMind AI

## Objective
A Retrieval-Augmented Generation (RAG) system that answers questions strictly based on company documents — no hallucination, no out-of-scope answers.

## Tech Stack
```
Backend        → Node.js + Express
Database       → MongoDB Atlas (vector store)
Embeddings     → Gemini (gemini-embedding-001)
LLM            → Gemini (gemini-2.0-flash)
File Handling  → Multer + pdf-parse
```

---

## System Flows

### Ingestion Flow (Week 1)

```
PDF Upload (POST /api/upload)
   │
   ▼
[pdfParser.js]        →  Extract raw text from PDF
   │
   ▼
[chunker.js]          →  Split into overlapping chunks (1000 chars, 100 overlap)
   │
   ▼
[embedder.js]         →  Convert each chunk → vector via gemini-embedding-001
   │
   ▼
[MongoDB Atlas]       →  Store { text, embedding, source, page }
```

### Query Flow (Week 2)

```
User Question (POST /api/query)
   │
   ▼
[queryEmbedder.js]    →  Convert question → vector via gemini-embedding-001
   │
   ▼
[vectorSearch.js]     →  $vectorSearch → top 5 matching chunks
   │
   ▼
[resultSorter.js]     →  Sort by similarity score (highest first)
   │
   ▼
[resultFormatter.js]  →  Trim text, shape { text, source, score }
```

### Answer Generation Flow (Week 3)

```
Retrieved Chunks
   │
   ▼
[chatAgent.js]        →  Build grounded prompt with context + question
   │
   ▼
[Gemini LLM]          →  Generate answer strictly from context
   │
   ▼
[query.js]            →  Return { answer, sources, isOutOfContext }
```

### Full End-to-End RAG Flow

```
PDF Documents
   │
   ▼
Chunks + Embeddings → MongoDB Atlas
                              │
                              │
User Question ────────────────┘
   │
   ▼
Query Embedding → Vector Search → Top 5 Chunks
                                        │
                                        ▼
                              Gemini LLM (grounded prompt)
                                        │
                                        ▼
                              Final Answer + Source Citations
```

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                     → MongoDB Atlas connection
│   ├── constants/
│   │   └── retriever.constants.js    → TOP_K, NUM_CANDIDATES, MAX_CHUNK_LENGTH
│   ├── models/
│   │   └── Document.js               → Mongoose schema { text, embedding, source, page }
│   ├── routes/
│   │   ├── upload.js                 → POST /api/upload
│   │   └── query.js                  → POST /api/query
│   ├── services/
│   │   ├── pdfParser.js              → PDF → raw text
│   │   ├── chunker.js                → text → overlapping chunks
│   │   ├── embedder.js               → text → Gemini vector
│   │   ├── retriever.js              → public entry point for retrieval
│   │   ├── retrieverPipeline.js      → orchestrates embed → search → sort → format
│   │   └── chatAgent.js              → context + question → Gemini answer
│   └── utils/
│       ├── queryEmbedder.js          → embeds the user question
│       ├── vectorSearch.js           → MongoDB $vectorSearch
│       ├── resultSorter.js           → sort by score
│       └── resultFormatter.js        → trim + shape results
└── docs/
    ├── week1.md
    ├── week2.md
    ├── week3.md
    └── architecture.md
```

---

## Key Design Principles

### 1. Strict grounding
Gemini is instructed to answer only from retrieved context.
Out-of-scope questions return a clean `isOutOfContext: true` flag instead of hallucinated answers.

### 2. Consistent embedding model
The same model (`gemini-embedding-001`) is used for both ingestion and querying.
This guarantees the query vector and chunk vectors live in the same space.

### 3. Single responsibility per file
Each utility (`vectorSearch`, `resultSorter`, `resultFormatter`) does exactly one thing.
The pipeline (`retrieverPipeline.js`) only orchestrates — it contains no business logic itself.

### 4. Zero breaking changes across weeks
`query.js` imports `retrieveChunks` from `retriever.js` throughout all three weeks.
Internal refactors in Week 3 are fully contained behind that interface.