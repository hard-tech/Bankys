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
        self.access_token_expire_minutes = 86400

    def register_user(self, user: User_Register, session: Session) -> User_Without_Password:
        """
        Enregistre un nouvel utilisateur dans la base de données.
        """
        try:
            # Vérifier si l'utilisateur existe déjà
            existing_user = session.query(User).filter(User.email == user.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Email déjà enregistré"
                )

            # Hacher le mot de passe de l'utilisateur
            hashed_password = get_password_hash(user.password)
            new_user = User(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                password=hashed_password
            )

            # Ajouter le nouvel utilisateur à la session
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
                detail="Échec de l'enregistrement"
            )

    def generate_token(self, user):
        """
        Génère un token JWT pour l'utilisateur authentifié.
        """
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
                detail=f"Échec de la génération du token: {str(e)}"
            )

    def authenticate_user(self, email: str, password: str, session: Session) -> User:
        """
        Authentifie un utilisateur en vérifiant ses identifiants.
        """
        user = session.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Identifiants invalides"
            )
        return user

    def get_current_user(
        self,
        token: HTTPAuthorizationCredentials = Depends(HTTPBearer())
    ) -> dict:
        """
        Récupère l'utilisateur actuel à partir du token JWT.
        """
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
                    detail="Le token a expiré"
                )

            return payload
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token d'authentification invalide"
            )

    def get_current_user_id(
        self,
        token: HTTPAuthorizationCredentials = Depends(HTTPBearer())
    ) -> int:
        """
        Récupère l'ID de l'utilisateur actuel à partir du token JWT.
        """
        payload = self.get_current_user(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="ID utilisateur non trouvé dans le token"
            )
        return int(user_id)

    def get_user_from_db(self, user_id: int, session: Session) -> User:
        """
        Récupère un utilisateur de la base de données par son ID.
        """
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        return user

user_service_instance_auth = UserService()