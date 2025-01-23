from datetime import datetime, timedelta
import jwt
from pydantic import EmailStr
from sqlalchemy.orm import Session
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends, HTTPException, status
from app.auth.models.user import User
from app.auth.domain.PasswordHasher import verify_password
from app.auth.schemas.user import User_Without_Password, User_Register
from app.auth.domain import get_password_hash
from app.accounts.services.account_service import account_service_instance

class UserService:
    def __init__(self):
        self.secret_key = "GCFDN4DA3HFKHZL0UN0WETV64IA3JOQ92HQ6694YJTVFMHELGYOLSB6MRVF3XZGYECPW993LY7K3PB92BTXLERGWXT8BYX"
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30

    def register_user(self, user: User_Register, session: Session) -> User_Without_Password:
        try:
            existing_user = session.query(User).filter(User.email == user.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Email already registered"
                )

            hashed_password = get_password_hash(user.password)
            new_user = User(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                password=hashed_password
            )

            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            # Création du compte principal avec 100€ (Story 11)
            account_service_instance.create_principal_account(new_user.id, session)

            return User_Without_Password(
                id=new_user.id,
                email=new_user.email,
                first_name=new_user.first_name,
                last_name=new_user.last_name
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )

    def generate_token(self, user):
        try:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
            payload = {
                "sub": str(user.id),
                "email": user.email,
                "exp": expire,
                "iat": datetime.utcnow()
            }
            return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Token generation failed: {str(e)}"
            )


    def authenticate_user(self, email: str, password: str, session: Session) -> User:
        user = session.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        return user

    def get_current_user(
        self,
        token: HTTPAuthorizationCredentials = Depends(HTTPBearer())
    ) -> dict:
        try:
            payload = jwt.decode(
                token.credentials,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            
            # Vérification de l'expiration
            exp = payload.get("exp")
            if not exp or datetime.fromtimestamp(exp) < datetime.utcnow():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired"
                )
                
            return payload
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
    def get_current_user_id( # TODO: Corriger la gestion des tokens avec un user_id unique (Story 10)
        self,
        token: HTTPAuthorizationCredentials = Depends(HTTPBearer())
    ) -> int:
        payload = self.get_current_user(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User ID not found in token"
            )
        return int(user_id)

    def get_user_from_db(self, user_id: int, session: Session) -> User:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

user_service_instance_auth = UserService()