from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.users import router as users_router
from app.routes.sports import router as sports_router
from app.routes.turf_slots import router as turf_slots_router
from app.routes.bookings import router as bookings_router
from app.routes.auth import router as auth_router
from app.routes.payment import router as payment_router
from app.routes.add_ons import router as add_ons_router

app = FastAPI(
    title="SportSphere API",
    description="Backend API for the SportSphere turf booking and management system.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(sports_router)
app.include_router(turf_slots_router)
app.include_router(bookings_router)
app.include_router(auth_router)
app.include_router(payment_router)
app.include_router(add_ons_router)

@app.get("/")
def root():
    return {"message": "SportSphere API is running!"}