from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.sport import Sport
from app.models.turf_slot import TurfSlot
from app.schemas.turf_slot import TurfSlotCreate, TurfSlotResponse

router = APIRouter(
    prefix="/slots",
    tags=["Turf Slots"],
)


@router.get("/", response_model=list[TurfSlotResponse])
def get_slots(db: Session = Depends(get_db)):
    return db.query(TurfSlot).all()


@router.post(
    "/",
    response_model=TurfSlotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_slot(
    slot_data: TurfSlotCreate,
    db: Session = Depends(get_db),
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

    slot = TurfSlot(
        sport_id=slot_data.sport_id,
        slot_date=slot_data.slot_date,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
        price=slot_data.price,
    )

    db.add(slot)
    db.commit()
    db.refresh(slot)

    return slot