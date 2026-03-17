from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CurePulse AI API",
    description="Rural Healthcare Intelligence Platform",
    version="1.0.0"
)

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "CurePulse AI API is running",
        "version": "1.0.0",
        "phase": "Phase 1 - Foundation"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}