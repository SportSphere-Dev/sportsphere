from datetime import date, time, timedelta

from sqlalchemy.orm import Session

from app.models.sport import Sport
from app.models.turf_slot import TurfSlot


OPENING_TIME = time(9, 0)
LUNCH_START = time(13, 0)
LUNCH_END = time(14, 0)
CLOSING_TIME = time(18, 0)


def generate_daily_slots(
    db: Session,
    sport: Sport,
    slot_date: date,
) -> list[TurfSlot]:
    """
    Generate the standard daily slots for a sport/date.

    Operating hours:
        09:00 - 18:00

    Lunch:
        13:00 - 14:00

    Slot duration:
        1 hour
    """

    existing_slots = (
        db.query(TurfSlot)
        .filter(
            TurfSlot.sport_id == sport.id,
            TurfSlot.slot_date == slot_date,
        )
        .all()
    )

    existing_times = {
        (slot.start_time, slot.end_time)
        for slot in existing_slots
    }

    slots_to_create = []

    current_minutes = 9 * 60
    closing_minutes = 18 * 60

    while current_minutes < closing_minutes:
        start_minutes = current_minutes
        end_minutes = current_minutes + 60

        start_time = time(
            start_minutes // 60,
            start_minutes % 60,
        )

        end_time = time(
            end_minutes // 60,
            end_minutes % 60,
        )

        # Skip lunch break
        if start_time >= LUNCH_START and start_time < LUNCH_END:
            current_minutes += 60
            continue

        if (start_time, end_time) not in existing_times:
            slots_to_create.append(
                TurfSlot(
                    sport_id=sport.id,
                    slot_date=slot_date,
                    start_time=start_time,
                    end_time=end_time,
                    price=sport.price_per_hour,
                    is_available=True,
                )
            )

        current_minutes += 60

    if slots_to_create:
        db.add_all(slots_to_create)
        db.commit()

        for slot in slots_to_create:
            db.refresh(slot)

    return (
        db.query(TurfSlot)
        .filter(
            TurfSlot.sport_id == sport.id,
            TurfSlot.slot_date == slot_date,
        )
        .order_by(TurfSlot.start_time)
        .all()
    )