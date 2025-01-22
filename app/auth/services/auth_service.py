from sqlalchemy.orm import Session
from app.auth.models.user import User  # Assuming User is the correct model
from app.auth.schemas.user import User_Without_Password, User_Register
from app.auth.domain import get_password_hash  # Assuming this function exists for hashing passwords
from app.accounts.services.account_service import account_service_instance

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

        account_service_instance.create_principal_account(new_user.id, session)

        # Return the user data without the password
        return User_Without_Password(
            id=new_user.id, 
            email=new_user.email, 
            first_name=new_user.first_name,
            last_name=new_user.last_name
        )
    
# Create an instance of UserService
user_service_instance_auth = UserService()