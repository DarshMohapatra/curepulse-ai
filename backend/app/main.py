from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, vitals, timeline
from .models import user, vitals as vitals_model, timeline as timeline_model

app = FastAPI(
    title="CurePulse AI API",
    description="Healthcare Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://frontend-chi-lilac-63.vercel.app",
        "https://curepulse-ai.vercel.app",
    ],
    allow_origin_regex=r"https://.*-darshmohapatras-projects\.vercel\.app",
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
    return {"message": "CurePulse AI API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(auth.router)
app.include_router(vitals.router)
app.include_router(timeline.router)