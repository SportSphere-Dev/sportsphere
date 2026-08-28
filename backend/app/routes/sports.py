from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.sport import Sport
from app.schemas.sport import SportCreate, SportResponse

router = APIRouter(
    prefix="/sports",
    tags=["Sports"],
)


@router.get("/", response_model=list[SportResponse])
def get_sports(db: Session = Depends(get_db)):
    return db.query(Sport).all()


@router.post(
    "/",
    response_model=SportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sport(
    sport_data: SportCreate,
    db: Session = Depends(get_db),
):
    existing_sport = (
        db.query(Sport)
        .filter(Sport.name == sport_data.name)
        .first()
    )

    if existing_sport:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Sport already exists",
        )

    sport = Sport(
        name=sport_data.name,
        description=sport_data.description,
        price_per_hour=sport_data.price_per_hour,
    )

    db.add(sport)
    db.commit()
    db.refresh(sport)

    return sport