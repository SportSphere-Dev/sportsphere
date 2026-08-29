from datetime import datetime

from typing import Literal

from pydantic import BaseModel, Field

class BookingAddOnCreate(BaseModel):
    add_on_id: int
    quantity: int = Field(gt=0, le=10)

class BookingCreate(BaseModel):
    slot_id: int
    number_of_players: int = Field(gt=0, le=20)
    add_ons: list[BookingAddOnCreate] = Field(default_factory=list)

class BookingAddOnResponse(BaseModel):
    add_on_id: int
    quantity: int
    unit_price: int

class BookingResponse(BaseModel):
    id: int
    user_id: int
    slot_id: int
    number_of_players: int
    status: Literal["held", "confirmed", "cancelled"]    
    total_price: int
    refund_amount: int
    created_at: datetime
    hold_expires_at: datetime | None
    add_ons: list[BookingAddOnResponse] = []

    model_config = {"from_attributes": True}