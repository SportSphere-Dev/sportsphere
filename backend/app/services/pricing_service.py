from datetime import date, time


WEEKEND_SURCHARGE = 0.20
PEAK_HOUR_SURCHARGE = 0.30


def calculate_slot_price(
    base_hourly_price: int,
    slot_date: date,
    start_time: time,
    end_time: time,
) -> int:
    """
    Calculate the final price for a turf slot.

    Weekend: +20%
    Peak hours (18:00-22:00): +30%
    Weekend + peak: both surcharges apply.
    """

    start_minutes = start_time.hour * 60 + start_time.minute
    end_minutes = end_time.hour * 60 + end_time.minute

    duration_minutes = end_minutes - start_minutes

    if duration_minutes <= 0:
        raise ValueError("Slot end time must be after start time")

    duration_hours = duration_minutes / 60

    price = base_hourly_price * duration_hours

    # Weekend: Saturday (5) or Sunday (6)
    if slot_date.weekday() >= 5:
        price *= 1 + WEEKEND_SURCHARGE

    # Peak hours: 18:00 - 22:00
    peak_start = 18 * 60
    peak_end = 22 * 60

    if start_minutes >= peak_start and end_minutes <= peak_end:
        price *= 1 + PEAK_HOUR_SURCHARGE

    return round(price)