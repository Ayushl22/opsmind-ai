## System Flow

### Ingestion Flow
PDF Upload → Text Extraction → Chunking → Embedding Generation → MongoDB Storage

### Query Flow
User Question → Query Embedding → Vector Similarity Search → Relevant Chunks → AI Answer Generation

### Final RAG Flow
PDFs → Chunks → Embeddings → Vector Database → User Query → Retrieved Context → Gemini LLM → Final Answer with Sources