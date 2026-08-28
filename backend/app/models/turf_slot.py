from datetime import date, time

from sqlalchemy import Boolean, Date, ForeignKey, Integer, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class TurfSlot(Base):
    __tablename__ = "turf_slots"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    sport_id: Mapped[int] = mapped_column(
        ForeignKey("sports.id"),
        nullable=False,
    )

    slot_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    price: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )