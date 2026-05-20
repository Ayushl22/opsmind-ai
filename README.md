# 🧠 OpsMind AI — Context-Aware Corporate Knowledge Brain

OpsMind AI is an AI-powered system that transforms static corporate SOP documents into an intelligent, searchable knowledge base. It enables employees to instantly retrieve accurate, context-aware answers from large collections of PDF documents.

---

## 🚀 Problem Statement

Organizations store hundreds of Standard Operating Procedures (SOPs) in PDFs, making it difficult for employees to quickly find relevant information.

- Manual search is slow ❌  
- Information is scattered ❌  
- High dependency on senior staff ❌  

---

## 💡 Solution

OpsMind AI solves this by:

- 📄 Uploading SOP PDFs  
- ✂️ Breaking them into chunks  
- 🧠 Converting them into embeddings (semantic meaning)  
- 🔍 Performing vector-based search  
- ⚡ Returning the most relevant information instantly  

---

## 🧠 Core Concept

This project is based on **Retrieval-Augmented Generation (RAG)**:
PDF → Chunking → Embeddings → Vector DB → Query → Relevant Chunks

---

## ⚙️ Tech Stack

- Backend: Node.js, Express
- Database: MongoDB Atlas
- AI Model: Google Gemini Embeddings
- File Upload: Multer
- PDF Parsing: pdf-parse

---

## 🏗️ Project Structure

backend/  
├── src/  
│   ├── config/  
│   │   └── db.js  
│   ├── models/  
│   │   └── Document.js  
│   ├── routes/  
│   │   ├── upload.js  
│   │   └── query.js  
│   ├── services/  
│   │   ├── chunker.js  
│   │   ├── embedder.js  
│   │   ├── pdfParser.js  
│   │   └── retriever.js  
│   └── index.js  
├── uploads/  
├── .env  
├── .gitignore  
├── package.json  
└── package-lock.json  

---

## 🗓️ Development Phases

### ✅ Week 1 — Knowledge Ingestion
- PDF upload
- PDF text extraction
- Text chunking
- Gemini embedding generation
- MongoDB storage

### ✅ Week 2 — Retrieval Engine
- User query input
- Query embedding generation
- MongoDB vector search
- Top relevant chunks returned with source and score

### 🔜 Week 3 — Chat Agent
- Generate final answers using Gemini
- Add citations
- Add chat interface

### 🔜 Week 4 — UI & Optimization
- Build a simple frontend interface (React)
- Implement chat UI for user interaction
- Display responses with clickable source citations
- Add chat history persistence
- Optimize performance of vector search and response time
- Improve UX (loading states, clean layout)
- End-to-end testing and debugging

---

## 🔌 API Endpoints

### Upload PDF

POST `/api/upload`

Request:
- form-data key: `file`

Response:
```json
{
  "message": "Upload + Processing Done"
}
```
---

### Query Knowledge Base

POST `/api/query`

**Request:**

    {
      "question": "What is this document about?"
    }

**Response:**

    {
      "question": "What is this document about?",
      "results": [
        {
          "text": "Relevant document chunk...",
          "source": "research.pdf",
          "score": 0.79
        }
      ]
    }

---

## ⚠️ Environment Variables

Create a `.env` file inside the backend folder:

    PORT=5000
    MONGO_URI=your_mongodb_uri
    GEMINI_API_KEY=your_gemini_api_key

---

## ▶️ How to Run

    cd backend
    npm install
    npm start

---

## 🧪 Testing

### Upload PDF

    curl.exe -X POST http://localhost:5000/api/upload --form "file=@path/to/file.pdf"

### Query the System

    curl.exe -X POST http://localhost:5000/api/query -H "Content-Type: application/json" -d "{\"question\":\"What is this document about?\"}"

---

## 🌟 Features

- Semantic search (not keyword-based)
- Vector embeddings using Gemini
- Fast retrieval using MongoDB vector search
- Source-aware responses
- Scalable architecture

---

## 🚀 Future Enhancements

- Chat UI (React frontend)
- LLM-generated answers (Week 3)
- Source citation interface
- Multi-document querying
- Authentication system

---

## 👥 Team

- Ishika Singh 
- Ayush Lambat
- Nupoor Mahajan
- Muhammad Ramees

---

## 📌 Summary

OpsMind AI is like ChatGPT for company documents, powered by embeddings and vector search.
