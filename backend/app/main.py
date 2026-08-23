from fastapi import FastAPI

from app.routes.users import router as users_router

app = FastAPI(
    title="SportSphere API",
    description="Backend API for the SportSphere turf booking and management system.",
    version="1.0.0",
)

app.include_router(users_router)


@app.get("/")
def root():
    return {"message": "SportSphere API is running!"}