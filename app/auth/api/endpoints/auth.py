from fastapi import APIRouter, Depends, status
from app.auth.services.auth_service import user_service_instance_auth
from app.db.session import get_session
from app.auth.schemas.user import User_Register, User_Without_Password, User_login
from app.core.exceptions import CustomHTTPException

router = APIRouter()

@router.post("/register", response_model=User_Without_Password)
def register_user(user: User_Register, session=Depends(get_session)):
    """
    Enregistre un nouvel utilisateur.
    """
    try:
        return user_service_instance_auth.register_user(user, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de l'enregistrement de l'utilisateur.",
            error_code="REGISTER_USER_ERROR"
        )

@router.post("/login")
def login(user: User_login, session=Depends(get_session)):
    """
    Authentifie un utilisateur et génère un token.
    """
    try:
        authenticated_user = user_service_instance_auth.authenticate_user(user.email, user.password, session)
        token = user_service_instance_auth.generate_token(authenticated_user)
        return {"token": token, "Authorization": "Bearer " + token} 
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de l'authentification de l'utilisateur.",
            error_code="LOGIN_ERROR"
        )

@router.get("/me")
def me(user=Depends(user_service_instance_auth.get_current_user)):
    """
    Récupère les informations de l'utilisateur authentifié.
    """
    if not user:
        raise CustomHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur non authentifié",
            error_code="USER_NOT_AUTHENTICATED"
        )
    return user