from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.booking import Booking
from app.models.turf_slot import TurfSlot
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
from app.dependencies import get_current_user, require_admin
from datetime import datetime, timedelta, timezone
from app.models.add_on import AddOn
from app.models.booking_add_on import BookingAddOn

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


@router.get("/my", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.id.desc())
        .all()
    )

@router.get("/admin", response_model=list[BookingResponse])
def get_all_bookings_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return (
        db.query(Booking)
        .order_by(Booking.id.desc())
        .all()
    )

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
    
    # 2. Check slot
    slot = (
        db.query(TurfSlot)
        .filter(TurfSlot.id == booking_data.slot_id)
        .with_for_update()
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    slot_datetime = datetime.combine(
        slot.slot_date,
        slot.start_time,
    ).replace(tzinfo=timezone.utc)

    if slot_datetime <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This time slot has already passed",
        )

    # 3. Check availability
    if not slot.is_available:
        existing_booking = (
            db.query(Booking)
            .filter(
                Booking.slot_id == slot.id,
                Booking.status.in_(["held", "confirmed"]),
            )
            .first()
        )

        if existing_booking:
            detail = "This slot is already booked"
        else:
            detail = "This slot is currently unavailable"

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
        )

    # 4. Calculate price on the backend
    total_price = slot.price

    selected_add_ons = []

    for add_on_data in booking_data.add_ons:
        add_on = (
            db.query(AddOn)
            .filter(
                AddOn.id == add_on_data.add_on_id,
                AddOn.is_active == True,
            )
            .with_for_update()
            .first()
        )

        if not add_on:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Add-on {add_on_data.add_on_id} not found or inactive",
            )

        add_on_total = add_on.price * add_on_data.quantity
        total_price += add_on_total

        selected_add_ons.append(
            (
                add_on,
                add_on_data.quantity,
            )
        )

    # 5. Create booking
    hold_expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    booking = Booking(
        user_id=current_user.id,
        slot_id=booking_data.slot_id,
        number_of_players=booking_data.number_of_players,
        status="held",
        total_price=total_price,
        hold_expires_at=hold_expires_at,
    )

    # 6. Make slot unavailable
    slot.is_available = False

    db.add(booking)
    db.flush()

    for add_on, quantity in selected_add_ons:
        booking_add_on = BookingAddOn(
            booking_id=booking.id,
            add_on_id=add_on.id,
            quantity=quantity,
            unit_price=add_on.price,
        )

        db.add(booking_add_on)

    db.commit()
    db.refresh(booking)

    return booking

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.user_id == current_user.id,
        )
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    return booking

@router.delete("/{booking_id}", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own booking",
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

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    slot_datetime = datetime.combine(
        slot.slot_date,
        slot.start_time,
    ).replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)

    time_until_booking = slot_datetime - now

    if time_until_booking >= timedelta(days=2):
        refund_amount = booking.total_price
    elif time_until_booking >= timedelta(days=1):
        refund_amount = int(booking.total_price * 0.75)
    else:
        refund_amount = 0

    booking.status = "cancelled"
    booking.refund_amount = refund_amount

    slot.is_available = True

    db.commit()
    db.refresh(booking)

    return booking