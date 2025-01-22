from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.auth.models.user import User  # Assuming User is the correct model
from app.auth.schemas.user import User_Without_Password, User_Register

class UserService:
    def get_user(self, user_id: int, session: Session) -> User_Without_Password:
        # Retrieve the user from the database using the User model
        user = session.query(User).filter_by(id=user_id).first()

        if user:
            # Convert the user model to a User_Without_Password schema
            return User_Without_Password(
                id=user.id, 
                email=user.email, 
                first_name=user.first_name,
                last_name=user.last_name
            )
        return None

    # def authenticate_user(self, email: str, password: str):
    #     # TODO: Implement user authentication logic
    #     return None

# Create an instance of UserService
user_service_instance_user = UserService()