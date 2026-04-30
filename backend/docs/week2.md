# Week 2 — Retrieval Engine

## Objective
Retrieve relevant document chunks based on user queries.

## Implementation Steps

1. Query Input
- User sends question via POST /api/query

2. Query Embedding
- Convert question into embedding using Gemini

3. Vector Search
- MongoDB Atlas vector similarity search
- Finds top 3–5 relevant chunks

4. Result Ranking
- Results sorted by similarity score

5. Response
- Returns relevant chunks with:
  - text
  - source
  - score

## Output
System retrieves relevant SOP content based on meaning, not keywords.