from datetime import date, time

from pydantic import BaseModel


class TurfSlotCreate(BaseModel):
    sport_id: int
    slot_date: date
    start_time: time
    end_time: time
    price: int


class TurfSlotResponse(BaseModel):
    id: int
    sport_id: int
    slot_date: date
    start_time: time
    end_time: time
    price: int
    is_available: bool

    model_config = {"from_attributes": True}