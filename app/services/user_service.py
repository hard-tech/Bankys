from fastapi import Depends
from app.db import session
from app.schemas import User_Without_Password
from app.db.database import get_db
from app.schemas.user import User_Register

class UserService:
    def register_user(self, user: User_Register, db: session = Depends(get_db)):
        # TODO: Implement user registration logic
        return None

    def get_user(self, user_id: int) -> User_Without_Password:
        # TODO: Implement user retrieval logic
        user = User_Without_Password(
            user_id=user_id,
            email="email@example.com",
            first_name="John Doe",
            last_name="Smith"
        )
        return user

    # def authenticate_user(self, email: str, password: str):
    #     # TODO: Implement user authentication logic
    #     return None

# Create an instance of UserService
user_service_instance = UserService()