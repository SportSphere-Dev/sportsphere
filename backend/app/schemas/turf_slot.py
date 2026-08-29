from datetime import date, time

from pydantic import BaseModel


class TurfSlotCreate(BaseModel):
    sport_id: int
    slot_date: date
    start_time: time
    end_time: time

class TurfSlotUpdate(BaseModel):
    slot_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    price: int | None = None
    is_available: bool | None = None

class TurfSlotResponse(BaseModel):
    id: int
    sport_id: int
    slot_date: date
    start_time: time
    end_time: time
    price: int
    is_available: bool

    model_config = {"from_attributes": True}