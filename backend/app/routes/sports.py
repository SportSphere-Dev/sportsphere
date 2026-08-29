from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.sport import Sport
from app.schemas.sport import SportCreate, SportResponse, SportUpdate
from app.dependencies import require_admin
from app.models.user import User

router = APIRouter(
    prefix="/sports",
    tags=["Sports"],
)


@router.get("/", response_model=list[SportResponse])
def get_sports(db: Session = Depends(get_db)):
    return db.query(Sport).all()


@router.get("/{sport_id}", response_model=SportResponse)
def get_sport(
    sport_id: int,
    db: Session = Depends(get_db),
):
    sport = (
        db.query(Sport)
        .filter(Sport.id == sport_id)
        .first()
    )

    if not sport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sport not found",
        )

    return sport

@router.post(
    "/",
    response_model=SportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sport(
    sport_data: SportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
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

@router.put(
    "/{sport_id}",
    response_model=SportResponse,
)
def update_sport(
    sport_id: int,
    sport_data: SportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    sport = (
        db.query(Sport)
        .filter(Sport.id == sport_id)
        .first()
    )

    if not sport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sport not found",
        )

    update_data = sport_data.model_dump(exclude_unset=True)

    if "name" in update_data:
        existing_sport = (
            db.query(Sport)
            .filter(
                Sport.name == update_data["name"],
                Sport.id != sport_id,
            )
            .first()
        )

        if existing_sport:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Sport already exists",
            )

    for field, value in update_data.items():
        setattr(sport, field, value)

    db.commit()
    db.refresh(sport)

    return sport