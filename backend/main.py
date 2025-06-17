from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

# Create the FastAPI application
app = FastAPI()

# Allow requests from the Angular frontend running on localhost:4200 (dev) or localhost:8080 (prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes from the router module
app.include_router(router)