from datetime import time


OPENING_TIME = time(9, 0)
LUNCH_START = time(13, 0)
LUNCH_END = time(14, 0)
CLOSING_TIME = time(18, 0)
SLOT_DURATION_MINUTES = 60


def calculate_slot_price(
    base_hourly_price: int,
    start_time: time,
    end_time: time,
) -> int:
    """
    Calculate the price for a slot using the sport's
    manually configured hourly price.

    No weekend or peak-hour surcharge is applied.
    """

    start_minutes = start_time.hour * 60 + start_time.minute
    end_minutes = end_time.hour * 60 + end_time.minute

    duration_minutes = end_minutes - start_minutes

    if duration_minutes <= 0:
        raise ValueError("Slot end time must be after start time")

    return round(base_hourly_price * (duration_minutes / 60))