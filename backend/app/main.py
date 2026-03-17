from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth
from .models import user  

app = FastAPI(
    title="CurePulse AI API",
    description="Rural Healthcare Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created")

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

app.include_router(auth.router)