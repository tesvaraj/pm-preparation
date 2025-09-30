from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, questions, attempts, friends, leaderboard

app = FastAPI(title="PM Interview Practice API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(attempts.router)
app.include_router(friends.router)
app.include_router(leaderboard.router)

@app.get("/")
async def root():
    return {"message": "PM Interview Practice API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
