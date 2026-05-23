# 🧠 OpsMind AI — Context-Aware Corporate Knowledge Brain

OpsMind AI is an AI-powered enterprise knowledge assistant that transforms static corporate SOPs and business documents into an intelligent, searchable, conversational knowledge system using Retrieval-Augmented Generation (RAG).

Instead of manually searching through large collections of PDFs, employees can simply ask questions in natural language and instantly receive accurate, context-aware answers with source references.

🌐 **Live Demo:** [https://opsmind-ai-wjwh.vercel.app/](https://opsmind-ai-wjwh.vercel.app/)

---

# 🚀 Problem Statement

Organizations store hundreds of:

- Standard Operating Procedures (SOPs)
- HR policies
- Compliance documents
- Internal reports
- Technical manuals
- Operational guidelines

Most of these documents exist as unstructured PDFs, creating several challenges:

- ❌ Manual searching is slow and inefficient
- ❌ Information is scattered across departments
- ❌ Employees depend heavily on senior staff
- ❌ Knowledge retrieval consumes valuable time
- ❌ Productivity decreases due to information silos

---

# 💡 Solution

OpsMind AI converts traditional corporate documents into an intelligent AI-powered knowledge base.

The platform:

- 📄 Uploads PDF documents
- ✂️ Extracts and chunks text
- 🧠 Generates semantic embeddings using Google Gemini
- 🗂️ Stores embeddings in MongoDB Atlas
- 🔍 Performs vector-based semantic retrieval
- 💬 Generates AI-powered context-aware responses
- 📌 Displays source-aware references for transparency

---

# 🧠 Core Concept — Retrieval-Augmented Generation (RAG)

```text
PDF Upload
   ↓
Text Extraction
   ↓
Chunking
   ↓
Embedding Generation
   ↓
MongoDB Vector Storage
   ↓
Semantic Retrieval
   ↓
Gemini Response Generation
   ↓
Context-Aware Answer
```

---

# ✨ Features

## 📄 Intelligent Document Processing

- Upload and process PDF documents
- Automatic text extraction
- Semantic text chunking
- Multi-document support

## 🧠 AI-Powered Semantic Search

- Google Gemini embeddings
- Vector similarity search
- Natural language querying
- Context-aware retrieval

## 💬 Conversational AI Chat

- AI-generated responses
- Conversational query handling
- Context-aware answer generation
- Human-like interaction

## 📌 Source-Aware Responses

- Document citation support
- Relevant chunk references
- Transparency in generated answers
- Retrieval scoring support

## ⚡ Scalable Architecture

- Modular backend structure
- MongoDB Atlas integration
- Efficient retrieval pipeline
- Optimized semantic search

## 🎨 Modern Frontend Interface

- React-based frontend
- Clean and responsive UI
- Chat-style interaction
- Smooth user experience

---

# 🏗️ Tech Stack

## Backend

- Node.js
- Express.js

## Frontend

- React.js
- Vite
- React Router DOM
- Lucide React

## Database

- MongoDB Atlas
- MongoDB Vector Search

## AI & NLP

- Google Gemini Embeddings
- Retrieval-Augmented Generation (RAG)
- Google Generative AI SDK

## File Handling

- Multer
- pdf-parse

## Authentication & APIs

- JWT Authentication
- Google OAuth
- bcryptjs

---

# 📂 Project Structure

```text
opsmind-ai/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── models/
│   │   │   └── Document.js
│   │   │
│   │   ├── routes/
│   │   │   ├── upload.js
│   │   │   ├── query.js
│   │   │   └── auth.js
│   │   │
│   │   ├── services/
│   │   │   ├── chunker.js
│   │   │   ├── embedder.js
│   │   │   ├── pdfParser.js
│   │   │   ├── retriever.js
│   │   │   └── generator.js
│   │   │
│   │   └── index.js
│   │
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── .gitignore
└── README.md
```

---

# ⚙️ How It Works

## Step 1 — Upload Documents

Users upload SOP or corporate PDF files.

## Step 2 — Text Extraction

The system extracts raw text from PDFs using `pdf-parse`.

## Step 3 — Semantic Chunking

Large text is split into meaningful semantic chunks.

## Step 4 — Embedding Generation

Google Gemini converts chunks into vector embeddings.

## Step 5 — Vector Storage

Embeddings are stored inside MongoDB Atlas.

## Step 6 — User Query

Users ask questions in natural language.

## Step 7 — Semantic Retrieval

The system retrieves the most relevant document chunks.

## Step 8 — AI Response Generation

Gemini generates context-aware responses.

## Step 9 — Source Citation

Relevant document sources are displayed with responses.

---

# 🗓️ Development Timeline

# ✅ Week 1 — Knowledge Ingestion

- PDF upload system
- PDF text extraction
- Chunking pipeline
- Gemini embedding generation
- MongoDB integration

# ✅ Week 2 — Retrieval Engine

- Query embedding generation
- Vector similarity search
- Semantic retrieval pipeline
- Source-aware retrieval
- Relevance scoring

# ✅ Week 3 — AI Chat Agent

- Gemini response generation
- Conversational querying
- Context-aware answer generation
- Citation integration

# ✅ Week 4 — Frontend & Optimization

- React frontend implementation
- Chat interface
- Loading states & UX improvements
- Authentication support
- End-to-end testing
- Performance optimization

---

# 🔌 API Endpoints

# 📄 Upload PDF

## Endpoint

```http
POST /api/upload
```

## Request

Form-data:

```text
file → PDF File
```

## Response

```json
{
  "message": "Upload + Processing Completed Successfully"
}
```

---

# 🔍 Query Knowledge Base

## Endpoint

```http
POST /api/query
```

## Request

```json
{
  "question": "What is this document about?"
}
```

## Response

```json
{
  "question": "What is this document about?",
  "results": [
    {
      "text": "Relevant document chunk...",
      "source": "company-policy.pdf",
      "score": 0.92
    }
  ]
}
```

---

# 💬 AI Chat Endpoint

## Endpoint

```http
POST /api/chat
```

## Request

```json
{
  "message": "Explain the employee onboarding process"
}
```

## Response

```json
{
  "answer": "The employee onboarding process involves...",
  "sources": [
    "HR_Onboarding.pdf"
  ]
}
```

---

# ⚠️ Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_uri

GEMINI_API_KEY=your_google_gemini_api_key

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
```

---

# ▶️ Installation & Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/opsmind-ai.git
```

---

# 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

# 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🧪 API Testing

# Upload PDF

```bash
curl.exe -X POST http://localhost:5000/api/upload --form "file=@path/to/file.pdf"
```

---

# Query System

```bash
curl.exe -X POST http://localhost:5000/api/query -H "Content-Type: application/json" -d "{\"question\":\"What is this document about?\"}"
```

---

# Chat with AI

```bash
curl.exe -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Explain company leave policy\"}"
```

---

# 🌟 Key Advantages

- ✅ AI-powered enterprise knowledge retrieval
- ✅ Semantic search instead of keyword matching
- ✅ Faster employee onboarding and support
- ✅ Reduced dependency on senior employees
- ✅ Source-aware transparent responses
- ✅ Scalable and modular architecture
- ✅ Better operational efficiency

---

# 🚀 Future Enhancements

- 🔐 Role-based access control
- ☁️ Cloud deployment support
- 📊 Analytics dashboard
- 🧠 Multi-turn conversational memory
- 🌍 Multi-language support
- 📱 Mobile responsiveness improvements
- 🔎 Advanced document filtering

---

# 👥 Team

- Ishika Singh
- Ayush Lambat
- Nupoor Mahajan
- Muhammad Ramees

---

# 📌 Project Summary

OpsMind AI acts like ChatGPT for enterprise documents.

By combining:

- Retrieval-Augmented Generation (RAG)
- Google Gemini Embeddings
- MongoDB Vector Search
- AI-powered semantic retrieval

OpsMind AI transforms static corporate documents into an intelligent enterprise knowledge brain capable of delivering fast, accurate, and context-aware information retrieval.

---

# ⭐ If you like this project, consider giving it a star on GitHub!
