"""prevent duplicate slot bookings

Revision ID: 1553a017e1fd
Revises: 9fed838964fb
Create Date: 2026-08-28 12:30:16.366128

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "1553a017e1fd"
down_revision: Union[str, Sequence[str], None] = "9fed838964fb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_index(
        "ix_bookings_active_slot",
        "bookings",
        ["slot_id"],
        unique=True,
        postgresql_where=sa.text("status = 'confirmed'"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        "ix_bookings_active_slot",
        table_name="bookings",
    )