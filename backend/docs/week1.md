# Week 1 — Knowledge Ingestion Pipeline

## Objective
Convert uploaded SOP PDFs into structured, AI-readable data.

## Implementation Steps

1. File Upload
- Implemented using Multer
- API endpoint: POST /api/upload

2. PDF Text Extraction
- Used pdf-parse to extract raw text

3. Text Chunking
- Split large text into smaller chunks
- Each chunk stored separately

4. Embedding Generation
- Used Google Gemini embeddings
- Each chunk converted into vector representation

5. Database Storage
- Stored in MongoDB Atlas
- Fields:
  - text
  - embedding
  - source file

## Output
Database contains vectorized document chunks ready for semantic search.