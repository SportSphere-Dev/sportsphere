from fastapi import FastAPI

app = FastAPI(
    title="SportSphere API",
    description="Backend API for the SportSphere turf booking and management system.",
    version="1.0.0",
)

@app.get("/")
def root():
    return {"message" : "SportSphere API is running!"}