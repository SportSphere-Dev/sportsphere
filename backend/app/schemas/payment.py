from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class PaymentCreate(BaseModel):
    booking_id: int


class PaymentVerify(BaseModel):
    payment_id: int
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
    
class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: int
    status: Literal["pending", "success", "failed"]
    provider: str
    provider_order_id: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

class PaymentOrderResponse(BaseModel):
    id: int
    booking_id: int
    amount: int
    status: Literal["pending", "success", "failed"]
    provider: str
    provider_payment_id: str | None
    razorpay_key_id: str
    razorpay_order_id: str
    created_at: datetime