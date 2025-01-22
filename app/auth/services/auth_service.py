import jwt
import os as fs
from pydantic import EmailStr
from sqlalchemy.orm import Session
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends, HTTPException, status
from app.auth.models.user import User
from app.auth.domain.PasswordHasher import verify_password
from app.auth.schemas.user import User_Without_Password, User_Register
from app.auth.domain import get_password_hash  # Assuming this function exists for hashing passwords
from app.accounts.services.account_service import account_service_instance

secret_key = "GCFDN4DA3HFKHZL0UN0WETV64IA3JOQ92HQ6694YJTVFMHELGYOLSB6MRVF3XZGYECPW993LY7K3PB92BTXLERGWXT8BYX"
algorithm = "HS256"
bearer_scheme = HTTPBearer()

class UserService:
    def register_user(self, user: User_Register, session: Session) -> User_Without_Password:
        try:
            # Check if the user already exists
            existing_user = session.query(User).filter(User.email == user.email).first()
            if existing_user:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
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

        except HTTPException as e:
            raise e  # Re-raise known HTTP exceptions
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An error occurred during registration")

    def authenticate_user(self, email: str, password: str, session: Session):
        user = session.query(User).filter(User.email == email).first()
        if user and verify_password(password, user.password):
            return user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    def generate_token(self, user: User):
        try:
            user_data = {"id": user.id, "email": user.email}
            return jwt.encode(user_data, secret_key, algorithm=algorithm)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Token generation failed")

    def get_user(self, authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
        try:
            payload = jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Create an instance of UserService
user_service_instance_auth = UserService()