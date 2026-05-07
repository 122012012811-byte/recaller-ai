# 🧠 RECALLR AI
**AI Memory Vault — Your Personal Knowledge Assistant**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)

> **100% FREE STACK** • **Beginner Friendly** • **Production Ready**

Transform your PDFs, notes, screenshots, and voice recordings into an intelligent, searchable AI memory vault. Get instant answers, automatic summaries, and smart revision notes powered by RAG (Retrieval-Augmented Generation).

**Built by [Mohamed](https://github.com/waseemdevs)**

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
```markdown
# 🧠 RECALLR AI
**AI Memory Vault — Your Personal Knowledge Assistant**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)

> **100% FREE STACK** • **Beginner Friendly** • **Production Ready**

Transform your PDFs, notes, screenshots, and voice recordings into an intelligent, searchable AI memory vault. Get instant answers, automatic summaries, and smart revision notes powered by RAG (Retrieval-Augmented Generation).

**Built by [Mohamed](https://github.com/waseemdevs)**

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
git clone https://github.com/YOUR_USERNAME/recaller-ai.git
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

-- Create tables (see full schema in docs)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(384),
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

-- Create policies
CREATE POLICY "Users manage own files"
  ON files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own chunks"
  ON chunks FOR ALL USING (auth.uid() = user_id);
```

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
pip install -r requirements.txt

# Create .env file
code .env
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

Visit: `http://localhost:8000/docs` for API docs