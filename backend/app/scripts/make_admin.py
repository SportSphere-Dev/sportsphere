from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.user import User


def make_admin(email: str):
    db: Session = SessionLocal()

    try:
        user = db.query(User).filter(User.email == email).first()

        if not user:
            print("User not found")
            return

        user.role = "admin"
        db.commit()

        print("User promoted to admin successfully")

    finally:
        db.close()


if __name__ == "__main__":
    email = input("Enter user email: ")
    make_admin(email)