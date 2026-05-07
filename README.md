# 🧠 RECALLR AI
**AI Memory Vault — Your Personal Knowledge Assistant**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)

> **100% FREE STACK** • **Beginner Friendly** • **Production Ready**

Transform your PDFs, notes, screenshots, and voice recordings into an intelligent, searchable AI memory vault. Get instant answers, automatic summaries, and smart revision notes powered by RAG (Retrieval-Augmented Generation).

**Built by Mohamed | [GitHub](https://github.com/waseemdevs)**

---

## 🎯 What Does Recallr AI Do?

Recallr AI is your personal AI-powered second brain that:

✅ **Uploads & Processes** - PDFs, images, screenshots, voice notes  
✅ **Extracts Intelligence** - Auto-extracts text using OCR & speech-to-text  
✅ **Semantic Search** - Find information by meaning, not just keywords  
✅ **AI Chat Interface** - Ask questions and get answers from YOUR documents only  
✅ **Smart Summaries** - Automatic summaries and revision notes generation  
✅ **Zero Hallucination** - AI answers ONLY from your uploaded content (RAG architecture)

Perfect for **students**, **researchers**, **professionals**, and anyone who wants to remember everything they read!

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RECALLR AI ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│  📱 FRONTEND (Next.js 14 + TypeScript + Tailwind)              │
│     ↓ User uploads file                                         │
│  🐍 BACKEND (Python FastAPI)                                    │
│     → Extract text (PyMuPDF / Tesseract OCR / Whisper)         │
│     → Split into chunks (LangChain)                             │
│     → Create embeddings (sentence-transformers)                 │
│     → Store in vector database                                  │
│  🗄️ DATABASE (Supabase PostgreSQL + pgvector)                  │
│     → Vector similarity search                                  │
│     → Retrieve relevant chunks                                  │
│  🤖 AI MODEL (GPT-4o / GPT-4.1 via VS Code Student Account)    │
│     → Generate answer from context only                         │
│     → Stream response to user                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Tech Stack:**
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Python FastAPI, LangChain, sentence-transformers
- **Database:** Supabase (PostgreSQL + pgvector + Auth + Storage)
- **AI Models:** GPT-4o, GPT-4.1, GPT-5 mini (FREE via GitHub Models)
- **Processing:** PyMuPDF (PDF), Tesseract (OCR), Faster Whisper (Audio)

---

## ✨ Key Features

### 📤 Multi-Format Upload
- **PDF Documents** - Textbooks, research papers, lecture notes
- **Images** - Screenshots, handwritten notes, diagrams (OCR)
- **Audio Files** - Voice recordings, lectures (speech-to-text)

### 🔍 Semantic Search
- Search by meaning, not just keywords
- Powered by 384-dimensional vector embeddings
- Lightning-fast pgvector cosine similarity search

### 💬 AI Chat Interface
- Ask questions in natural language
- Get answers sourced ONLY from your documents
- Streaming responses for real-time interaction
- Chat history saved for context

### 📝 Auto-Generation
- **Summaries** - Concise overviews of long documents
- **Revision Notes** - Structured study materials
- **Flashcards** - Quick review cards (coming soon)

### 🔒 Privacy & Security
- Your data stays in YOUR Supabase instance
- Row-level security (RLS) ensures users see only their own files
- No data shared with third parties

---

## 🚀 Quick Start

### Prerequisites

Make sure you have these installed:
- **Node.js** (v20+) - [Download](https://nodejs.org)
- **Python** (3.11+) - [Download](https://python.org)
- **Git** - [Download](https://git-scm.com)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com)

### 1. Clone the Repository

```bash
git clone https://github.com/122012012811-byte/recaller-ai.git
cd recaller-ai
```

### 2. Setup Accounts (All FREE!)

1. **GitHub Account** - [Sign up](https://github.com/signup)
2. **Supabase Account** - [Sign up](https://supabase.com) → Create new project
3. **Vercel Account** (for deployment) - [Sign up](https://vercel.com)

### 3. Database Setup (Supabase)

Go to your Supabase project → **SQL Editor** → Run this:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create tables
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  total_files INTEGER DEFAULT 0,
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT,
  size BIGINT,
  storage_path TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  page_count INTEGER,
  extracted_text TEXT,
  summary TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  page_number INTEGER,
  metadata JSONB DEFAULT '{}',
  embedding vector(384),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT DEFAULT 'New Chat',
  file_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]',
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'summary',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector search function
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  file_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.content,
    c.file_id,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM chunks c
  WHERE c.user_id = p_user_id
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create index for fast vector search
CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY 'Users can view own profile'
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY 'Users can update own profile'
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY 'Users manage own files'
  ON files FOR ALL USING (auth.uid() = user_id);

CREATE POLICY 'Users manage own chunks'
  ON chunks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY 'Users manage own chats'
  ON chats FOR ALL USING (auth.uid() = user_id);

CREATE POLICY 'Users manage own messages'
  ON messages FOR ALL USING (auth.uid() = user_id);
```

**Create Storage Bucket:**
- Supabase Dashboard → **Storage** → **Create Bucket**
- Name: `user-uploads`
- Public: **NO** (private bucket)

### 4. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-multipart python-dotenv pydantic pydantic-settings
pip install sqlalchemy asyncpg psycopg2-binary supabase
pip install langchain langchain-community langchain-openai sentence-transformers
pip install PyMuPDF pdfplumber pytesseract Pillow opencv-python-headless faster-whisper
pip install pgvector httpx python-jose passlib aiofiles

# Save dependencies
pip freeze > requirements.txt

# Create .env file
cp .env.example .env
# Edit with your credentials
```

**Backend `.env` file:**
```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

DATABASE_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

SECRET_KEY=your-super-secret-key-minimum-32-chars-long

# VS Code Student Account / GitHub Models
OPENAI_API_KEY=your_github_copilot_token
OPENAI_BASE_URL=https://models.inference.ai.azure.com

FRONTEND_URL=http://localhost:3000
```

**Get Supabase credentials:**
- Supabase Dashboard → **Settings** → **API**
- Copy `Project URL` and `anon public` key
- Copy `service_role` key (⚠️ keep secret!)

**Get Database URL:**
- Supabase Dashboard → **Settings** → **Database** → Connection string → URI

**Run the backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

Visit: `http://localhost:8000/docs` (Swagger API documentation)

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit with your credentials
```

**Frontend `.env.local` file:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Run the frontend:**
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 📁 Project Structure

```
recaller-ai/
├── frontend/                    # Next.js app
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── upload/page.tsx
│   │   │   ├── chat/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   └── vault/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── layout/
│   │   ├── upload/
│   │   └── chat/
│   └── lib/
│
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point
│   │   ├── config.py           # Settings
│   │   ├── database.py         # DB connection
│   │   ├── api/                # Route handlers
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   ├── rag/                # RAG pipeline
│   │   ├── embeddings/         # Vector embeddings
│   │   ├── processors/         # File processing
│   │   └── prompts/            # LLM prompts
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## 🎨 Features Walkthrough

### 1. Upload Files
- Drag & drop or click to upload
- Supports: PDF, PNG, JPG, MP3, WAV
- Auto-processes in background
- Progress tracking with real-time updates

### 2. AI Chat
- Ask questions about your documents
- Get context-aware answers
- See source citations
- Streaming responses

### 3. Smart Search
- Search across all your documents
- Semantic understanding (not just keywords)
- Filter by file type, date, tags
- Instant results

### 4. Memory Vault
- View all uploaded files
- Quick preview
- Download originals
- Delete files

### 5. Revision Notes
- Auto-generate study notes
- Structured format
- Key points highlighted
- Export as PDF (coming soon)

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import from GitHub → Select `recaller-ai`
4. Root Directory: `frontend`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
6. Deploy!

### Backend (Railway.app)

1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub repo
3. Root Directory: `backend`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env`
6. Deploy!

**Alternative:** Use [Render.com](https://render.com) (also free)

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

---

## 🐛 Common Issues & Solutions

### CORS Error
**Problem:** Frontend can't reach backend  
**Solution:** Add your frontend URL to CORS settings in `backend/app/main.py`

### pgvector Dimension Mismatch
**Problem:** `different vector dimensions 384 and 1536`  
**Solution:** Always use same embedding model (all-MiniLM-L6-v2 = 384 dims)

### Tesseract Not Found
**Problem:** `pytesseract.pytesseract.TesseractNotFoundError`  
**Solution:** Install Tesseract separately - [Windows](https://github.com/UB-Mannheim/tesseract/wiki), Mac: `brew install tesseract`

### Virtual Environment Issues
**Problem:** `ModuleNotFoundError: No module named 'fastapi'`  
**Solution:** Activate venv first: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)

---

## 📚 Documentation

Full documentation available in Tamil and English:
- [Setup Guide (Tamil)](docs/setup-ta.md)
- [API Documentation](docs/api.md)
- [Architecture Deep Dive](docs/architecture.md)
- [Deployment Guide](docs/deployment.md)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **LangChain** - RAG framework
- **Supabase** - Backend infrastructure
- **Vercel** - Frontend hosting
- **sentence-transformers** - Embedding models
- **FastAPI** - Backend framework
- **Next.js** - Frontend framework

---

## 📧 Contact

**Mohamed** - [@waseemdevs](https://github.com/waseemdevs)

Project Link: [https://github.com/122012012811-byte/recaller-ai](https://github.com/122012012811-byte/recaller-ai)

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐️!

---

**Made with ❤️ for students and lifelong learners**
