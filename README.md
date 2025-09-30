# PM Interview Practice App

A web application for practicing product management interview questions with AI-powered feedback and peer comparison.

## Features

- <¤ Voice recording for interview answers
- > AI-powered evaluation using Claude
- =Ê Performance tracking and leaderboards
- =e Compete with friends
-  Create and share PM interview questions

## Tech Stack

### Frontend
- React + Vite
- Web Audio API for recording

### Backend
- FastAPI (Python)
- SQLAlchemy + SQLite
- Anthropic Claude API (answer evaluation)
- OpenAI Whisper API (speech-to-text)

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env  # Add your API keys
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:
```
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
SECRET_KEY=your_secret_key_here
```

## Repository

GitHub: https://github.com/tesvaraj/pm-preparation
