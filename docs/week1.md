# Week 1 — Knowledge Ingestion / Data Pipeline

## Objective
Convert raw PDF documents into AI-understandable vector data stored in MongoDB Atlas.

## New Files
```
src/config/db.js
src/models/Document.js
src/routes/upload.js
src/services/pdfParser.js
src/services/chunker.js
src/services/embedder.js
src/index.js
```

---

## How It Works

### Ingestion Pipeline

```
PDF Upload (Multer)
   │
   ▼
[pdfParser.js]   →  Extract raw text from PDF pages
   │
   ▼
[chunker.js]     →  Split text into overlapping chunks (1000 chars, 100 overlap)
   │
   ▼
[embedder.js]    →  Convert each chunk → vector embedding via Gemini
   │
   ▼
[Document.js]    →  Store { text, embedding, source, page } in MongoDB Atlas
```

---

## Key Design Decisions

### 1. Multer for file handling
Uploaded PDFs are saved temporarily to the `uploads/` folder by Multer.
This keeps the upload and processing steps decoupled.

### 2. Chunking with overlap
Text is split into 1000-character chunks with a 100-character overlap.
The overlap ensures context is never lost at chunk boundaries — critical for accurate retrieval later.

### 3. Gemini for embeddings
Each chunk is converted to a vector using `gemini-embedding-001`.
Gemini embeddings are used consistently for both ingestion and querying — ensuring the vector space matches at search time.

### 4. MongoDB Atlas as vector store
Each chunk is stored as a separate document with its embedding alongside the raw text and source filename.
This allows MongoDB Atlas vector search to retrieve the most relevant chunks later.

---

## API Contract

### Request
```
POST /api/upload
Content-Type: multipart/form-data

file: <your PDF file>
```

### Response — success
```json
{
  "message": "Upload + Processing Done"
}
```

### Response — error
```json
{
  "message": "Error"
}
```

---

## Dependencies Added
```json
"multer"                  → file upload handling
"pdf-parse"               → PDF text extraction
"@google/generative-ai"   → Gemini embedding generation
"mongoose"                → MongoDB Atlas connection + schema
"express"                 → REST API server
"dotenv"                  → environment variable management
```