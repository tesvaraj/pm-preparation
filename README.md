# PM Interview Practice

A web application for practicing product management interview questions with AI-powered feedback and social features.

## Features

- **Voice Recording**: Record your answers with a simple pulse button interface
- **AI Evaluation**: Get detailed feedback using Claude 3.5 Sonnet on 5 key criteria
- **Transcription**: Automatic speech-to-text using OpenAI Whisper
- **Performance Tracking**: View scores and improvement areas
- **Social Features**: Add friends and compare performance
- **Leaderboards**: Global and friends-only rankings

## Tech Stack

### Frontend
- React + Vite
- Web Audio API for recording
- JWT authentication

### Backend
- FastAPI
- SQLAlchemy + SQLite
- Alembic for migrations
- Anthropic Claude API
- OpenAI Whisper API

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- API keys for Anthropic (Claude) and OpenAI (Whisper)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Edit `.env` with your configuration:
```
DATABASE_URL=sqlite:///./pm_practice.db
SECRET_KEY=your-secret-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
OPENAI_API_KEY=your-openai-key-here
```

6. Run database migrations:
```bash
alembic upgrade head
```

7. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or log in
2. **Browse Questions**: View available PM interview questions
3. **Practice**: Click on a question and press the big pulse button to start recording
4. **Get Feedback**: Submit your recording to receive AI-powered evaluation
5. **Track Progress**: View your scores and compare with friends on the leaderboard

## Project Structure

```
pm-preparation/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # AI services (transcription, evaluation)
│   │   ├── auth.py          # JWT authentication
│   │   ├── database.py      # Database configuration
│   │   └── main.py          # FastAPI application
│   ├── alembic/             # Database migrations
│   ├── uploads/             # Audio file storage
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API client
    │   └── App.jsx          # Main app component
    └── package.json
```

## Deployment

### Backend (Railway/Fly.io)

1. Add a `Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

2. Set environment variables in your hosting platform
3. Connect your GitHub repository
4. Deploy

### Frontend (Vercel/Netlify)

1. Update API URL in `frontend/src/services/api.js`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Repository

GitHub: https://github.com/tesvaraj/pm-preparation

## License

MIT
