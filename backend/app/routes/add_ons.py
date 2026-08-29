from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies import require_admin
from app.models.add_on import AddOn
from app.models.user import User
from app.schemas.add_on import (
    AddOnCreate,
    AddOnResponse,
    AddOnUpdate,
)

router = APIRouter(
    prefix="/add-ons",
    tags=["Add-ons"],
)


@router.get(
    "/",
    response_model=list[AddOnResponse],
)
def get_active_add_ons(
    db: Session = Depends(get_db),
):
    return (
        db.query(AddOn)
        .filter(AddOn.is_active == True)
        .order_by(AddOn.name)
        .all()
    )


@router.post(
    "/",
    response_model=AddOnResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_add_on(
    add_on_data: AddOnCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    existing_add_on = (
        db.query(AddOn)
        .filter(AddOn.name == add_on_data.name)
        .first()
    )

    if existing_add_on:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Add-on already exists",
        )

    if add_on_data.price < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price cannot be negative",
        )

    add_on = AddOn(
        name=add_on_data.name,
        description=add_on_data.description,
        price=add_on_data.price,
    )

    db.add(add_on)
    db.commit()
    db.refresh(add_on)

    return add_on


@router.put(
    "/{add_on_id}",
    response_model=AddOnResponse,
)
def update_add_on(
    add_on_id: int,
    add_on_data: AddOnUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    add_on = (
        db.query(AddOn)
        .filter(AddOn.id == add_on_id)
        .first()
    )

    if not add_on:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Add-on not found",
        )

    update_data = add_on_data.model_dump(exclude_unset=True)

    if "price" in update_data and update_data["price"] < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price cannot be negative",
        )

    if "name" in update_data:
        existing_add_on = (
            db.query(AddOn)
            .filter(
                AddOn.name == update_data["name"],
                AddOn.id != add_on_id,
            )
            .first()
        )

        if existing_add_on:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Add-on already exists",
            )

    for field, value in update_data.items():
        setattr(add_on, field, value)

    db.commit()
    db.refresh(add_on)

    return add_on


@router.delete(
    "/{add_on_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def deactivate_add_on(
    add_on_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    add_on = (
        db.query(AddOn)
        .filter(AddOn.id == add_on_id)
        .first()
    )

    if not add_on:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Add-on not found",
        )

    add_on.is_active = False

    db.commit()

    return None