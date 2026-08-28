from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.booking import Booking
from app.models.turf_slot import TurfSlot
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


@router.get("/", response_model=list[BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()


@router.post(
    "/",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Check user
    

    # 2. Check slot
    slot = (
        db.query(TurfSlot)
        .filter(TurfSlot.id == booking_data.slot_id)
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    # 3. Check availability
    if not slot.is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This slot is already booked",
        )

    # 4. Calculate price on the backend
    total_price = slot.price

    # 5. Create booking
    booking = Booking(
        user_id=current_user.id,
        slot_id=booking_data.slot_id,
        number_of_players=booking_data.number_of_players,
        status="confirmed",
        total_price=total_price,
    )

    # 6. Make slot unavailable
    slot.is_available = False

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking

@router.delete("/{booking_id}", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
):
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booking is already cancelled",
        )

    slot = (
        db.query(TurfSlot)
        .filter(TurfSlot.id == booking.slot_id)
        .with_for_update()
        .first()
    )

    booking.status = "cancelled"

    if slot:
        slot.is_available = True

    db.commit()
    db.refresh(booking)

    return booking