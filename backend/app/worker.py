from celery import Celery

celery_app = Celery(
    "sportsphere",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

celery_app.conf.timezone = "UTC"

celery_app.conf.beat_schedule = {
    "release-expired-booking-holds": {
        "task": "app.tasks.booking_tasks.release_expired_booking_holds",
        "schedule": 60.0,
    },
}
import app.tasks.booking_tasks