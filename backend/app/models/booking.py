from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.booking_add_on import BookingAddOn

class Booking(Base):
    __tablename__ = "bookings"

    

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    slot_id: Mapped[int] = mapped_column(
        ForeignKey("turf_slots.id"),
        nullable=False,
    )

    number_of_players: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="confirmed",
        nullable=False,
    )

    total_price: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    refund_amount: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    hold_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    add_ons: Mapped[list["BookingAddOn"]] = relationship(
        "BookingAddOn",
        back_populates="booking",
        cascade="all, delete-orphan",
    )