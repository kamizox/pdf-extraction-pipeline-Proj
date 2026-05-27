from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, analyze
import os

app = FastAPI(title="Pakistan Flood ML Dashboard")

# Allow both local development and production origins
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",  # Vite preview
]

# Add production frontend URL from environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)
    # Also allow without trailing slash
    allowed_origins.append(frontend_url.rstrip("/"))

# For Vercel deployments, allow all vercel.app domains in production
if os.getenv("RAILWAY_ENVIRONMENT"):  # Railway sets this environment variable
    allowed_origins.append("https://*.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Pakistan Flood ML Analytics API",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "dataset_info": "/api/dataset/info"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Pakistan Flood ML Backend",
        "platform": "Railway.app" if os.getenv("RAILWAY_ENVIRONMENT") else "Local"
    }
