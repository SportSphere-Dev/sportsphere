from datetime import datetime

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.turf_slot import TurfSlot


def release_expired_holds(db: Session):
    now = datetime.utcnow()

    expired_bookings = (
        db.query(Booking)
        .filter(
            Booking.status == "held",
            Booking.hold_expires_at.isnot(None),
            Booking.hold_expires_at <= now,
        )
        .all()
    )

    for booking in expired_bookings:
        booking.status = "cancelled"

        slot = (
            db.query(TurfSlot)
            .filter(TurfSlot.id == booking.slot_id)
            .first()
        )

        if slot:
            slot.is_available = True

        booking.hold_expires_at = None

    db.commit()