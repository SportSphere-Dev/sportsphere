import os
import razorpay
from dotenv import load_dotenv
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies import get_current_user
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentVerify, PaymentResponse, PaymentOrderResponse

load_dotenv()

razorpay_client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET"),
    )
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.post(
    "/",
    response_model=PaymentOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == payment_data.booking_id,
            Booking.user_id == current_user.id,
        )
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.status != "held":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booking is not available for payment",
        )

    if (
        booking.hold_expires_at is None
        or booking.hold_expires_at <= datetime.utcnow()
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment window has expired",
        )

    existing_payment = (
        db.query(Payment)
        .filter(Payment.booking_id == booking.id)
        .first()
    )

    if existing_payment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment already exists for this booking",
        )

    razorpay_order = razorpay_client.order.create({
        "amount": booking.total_price * 100,
        "currency": "INR",
        "receipt": f"booking_{booking.id}",
    })

    payment = Payment(
        booking_id=booking.id,
        amount=booking.total_price,
        status="pending",
        provider="razorpay",
        provider_order_id=razorpay_order["id"],
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return {
        "id": payment.id,
        "booking_id": payment.booking_id,
        "amount": payment.amount,
        "status": payment.status,
        "provider": payment.provider,
        "provider_payment_id": payment.provider_payment_id,
        "razorpay_key_id": os.getenv("RAZORPAY_KEY_ID"),
        "razorpay_order_id": razorpay_order["id"],
        "created_at": payment.created_at,
    }

@router.post(
    "/verify",
    response_model=PaymentResponse,
)
def verify_payment(
    payment_data: PaymentVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .join(Booking, Payment.booking_id == Booking.id)
        .filter(
            Payment.id == payment_data.payment_id,
            Booking.user_id == current_user.id,
        )
        .with_for_update()
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    if payment.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment has already been processed",
        )

    booking = (
        db.query(Booking)
        .filter(Booking.id == payment.booking_id)
        .with_for_update()
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.status != "held":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booking is no longer held",
        )

    if (
        booking.hold_expires_at is None
        or booking.hold_expires_at <= datetime.utcnow()
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment window has expired",
        )

    if payment.provider_order_id != payment_data.razorpay_order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment order does not match booking",
        )

    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": payment_data.razorpay_order_id,
            "razorpay_payment_id": payment_data.razorpay_payment_id,
            "razorpay_signature": payment_data.razorpay_signature,
        })
    except razorpay.errors.SignatureVerificationError:
        payment.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed",
        )

    payment.status = "success"
    payment.provider_payment_id = payment_data.razorpay_payment_id

    booking.status = "confirmed"
    booking.hold_expires_at = None

    db.commit()
    db.refresh(payment)

    return payment