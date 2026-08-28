from fastapi import FastAPI

from app.routes.users import router as users_router
from app.routes.sports import router as sports_router
from app.routes.turf_slots import router as turf_slots_router
from app.routes.bookings import router as bookings_router

app = FastAPI(
    title="SportSphere API",
    description="Backend API for the SportSphere turf booking and management system.",
    version="1.0.0",
)

app.include_router(users_router)
app.include_router(sports_router)
app.include_router(turf_slots_router)
app.include_router(bookings_router)

@app.get("/")
def root():
    return {"message": "SportSphere API is running!"}