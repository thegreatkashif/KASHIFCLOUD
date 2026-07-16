import argparse
import getpass

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


def reset_password():
    parser = argparse.ArgumentParser(description="Reset a Kashif Cloud user's password")
    parser.add_argument("--username", default="admin")
    args = parser.parse_args()

    password = getpass.getpass("New password for " + args.username + ": ")
    confirm = getpass.getpass("Confirm password: ")

    if password != confirm:
        print("Passwords do not match. Nothing changed.")
        return

    if len(password) < 8:
        print("Password must be at least 8 characters. Nothing changed.")
        return

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == args.username).first()
        if not user:
            print("User '" + args.username + "' not found.")
            return

        user.hashed_password = hash_password(password)
        db.commit()
        print("Password for '" + args.username + "' has been reset.")
    finally:
        db.close()


if __name__ == "__main__":
    reset_password()
