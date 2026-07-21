# Client Intelligence Platform

AI-powered client intelligence reports for health/wellness coaches. Analyzes conversation transcripts and produces structured, evidence-grounded reports with source-type tagging and human-in-the-loop review.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your API key in .env
#    Edit .env and add your GROQ_API_KEY (or other provider's key)

# 3. Start both backend + frontend
npm run dev:all

# Or run them separately:
npm run server   # Express API on port 3001
npm run dev      # Vite dev server on port 5173
```

Then open http://localhost:5173 in your browser.

## Architecture

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js (thin API layer holding the LLM key server-side)
- **LLM:** Groq (default), swappable to OpenAI/Gemini/Claude via `.env`
- **Storage:** In-memory only (no database)

## Key Features

- **Source-type tagging:** Every finding tagged as Confirmed Fact, Client-Reported, AI Inference, or Missing
- **Evidence grounding:** Expandable verbatim quotes from the transcript
- **Human review:** Approve / Edit / Reject per finding with edit audit trail
- **Schema validation:** LLM output validated before rendering; retry on invalid JSON
- **Export:** Final reviewed JSON download
- **Raw JSON toggle:** Debugging view of unedited model output

## LLM Provider Configuration

Set `LLM_PROVIDER` in `.env` to one of: `groq`, `openai`, `gemini`, `claude`

| Provider | API Key Variable | Default Model |
|----------|-----------------|---------------|
| Groq | `GROQ_API_KEY` | llama-3.3-70b-versatile |
| OpenAI | `OPENAI_API_KEY` | gpt-4o |
| Gemini | `GEMINI_API_KEY` | gemini-2.5-flash |
| Claude | `ANTHROPIC_API_KEY` | claude-sonnet-4-20250514 |
