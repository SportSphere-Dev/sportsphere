from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.sport import Sport
from app.models.turf_slot import TurfSlot
from app.schemas.turf_slot import (
    TurfSlotCreate,
    TurfSlotResponse,
    TurfSlotUpdate,
)
from app.dependencies import require_admin
from app.models.user import User
from app.models.booking import Booking
from app.services.booking_service import release_expired_holds
from app.services.pricing_service import calculate_slot_price

router = APIRouter(
    prefix="/slots",
    tags=["Turf Slots"],
)


@router.get("/", response_model=list[TurfSlotResponse])
def get_slots(
    sport_id: int | None = None,
    slot_date: date | None = None,
    db: Session = Depends(get_db),
):
    release_expired_holds(db)
    query = db.query(TurfSlot)

    if sport_id is not None:
        query = query.filter(TurfSlot.sport_id == sport_id)

    if slot_date is not None:
        query = query.filter(TurfSlot.slot_date == slot_date)

    return query.order_by(
        TurfSlot.slot_date,
        TurfSlot.start_time,
    ).all()


@router.post(
    "/",
    response_model=TurfSlotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_slot(
    slot_data: TurfSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    sport = (
        db.query(Sport)
        .filter(Sport.id == slot_data.sport_id)
        .first()
    )

    if not sport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sport not found",
        )

    existing_slot = (
        db.query(TurfSlot)
        .filter(
            TurfSlot.sport_id == slot_data.sport_id,
            TurfSlot.slot_date == slot_data.slot_date,
            TurfSlot.start_time == slot_data.start_time,
        )
        .first()
    )

    if existing_slot:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time slot already exists",
        )

    calculated_price = calculate_slot_price(
        base_hourly_price=sport.price_per_hour,
        slot_date=slot_data.slot_date,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
    )

    slot = TurfSlot(
        sport_id=slot_data.sport_id,
        slot_date=slot_data.slot_date,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
        price=calculated_price,
    )

    db.add(slot)
    db.commit()
    db.refresh(slot)

    return slot

@router.put(
    "/{slot_id}",
    response_model=TurfSlotResponse,
)
def update_slot(
    slot_id: int,
    slot_data: TurfSlotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    slot = (
        db.query(TurfSlot)
        .filter(TurfSlot.id == slot_id)
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    update_data = slot_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(slot, field, value)

    db.commit()
    db.refresh(slot)

    return slot


@router.patch(
    "/{slot_id}/availability",
    response_model=TurfSlotResponse,
)
def update_slot_availability(
    slot_id: int,
    is_available: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    slot = (
        db.query(TurfSlot)
        .filter(TurfSlot.id == slot_id)
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    if not is_available:
        active_booking = (
            db.query(Booking)
            .filter(
                Booking.slot_id == slot_id,
                Booking.status.in_(["held", "confirmed"]),
            )
            .first()
        )

        if active_booking:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot block a slot with an active booking",
            )

    slot.is_available = is_available

    db.commit()
    db.refresh(slot)

    return slot

@router.delete(
    "/{slot_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    slot = (
        db.query(TurfSlot)
        .filter(TurfSlot.id == slot_id)
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    existing_booking = (
        db.query(Booking)
        .filter(Booking.slot_id == slot_id)
        .first()
    )

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete a slot with booking history",
        )

    db.delete(slot)
    db.commit()

    return None