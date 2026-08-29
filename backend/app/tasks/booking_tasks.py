from app.database.connection import SessionLocal
from app.services.booking_service import release_expired_holds
from app.worker import celery_app


@celery_app.task
def release_expired_booking_holds():
    db = SessionLocal()

    try:
        release_expired_holds(db)
    finally:
        db.close()