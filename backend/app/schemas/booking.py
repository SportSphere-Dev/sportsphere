from datetime import datetime

from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    user_id: int
    slot_id: int
    number_of_players: int = Field(gt=0, le=20)


class BookingResponse(BaseModel):
    id: int
    user_id: int
    slot_id: int
    number_of_players: int
    status: str
    total_price: int
    created_at: datetime

    model_config = {"from_attributes": True}