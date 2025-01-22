from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.models.user import User  # Assuming User is the correct model
from app.schemas.user import User_Without_Password, User_Register
from app.core.security import get_password_hash  # Assuming this function exists for hashing passwords

class UserService:
    def register_user(self, user: User_Register, session: Session) -> User_Without_Password:
        # Hash the user's password
        hashed_password = get_password_hash(user.password)

        # Create a new User instance
        new_user = User(
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            password=hashed_password
        )

        # Add the new user to the session and commit
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # Return the user data without the password
        return User_Without_Password(
            id=new_user.id, 
            email=new_user.email, 
            first_name=new_user.first_name,
            last_name=new_user.last_name
        )
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
user_service_instance = UserService()