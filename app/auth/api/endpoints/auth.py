from fastapi import APIRouter, Depends
from app.auth.schemas.user import User_Register, User_Without_Password
from app.auth.services.auth_service import user_service_instance_auth
from app.auth.services.user_service import user_service_instance_user

from app.db.session import get_session

router = APIRouter()

@router.post("/register", response_model=User_Without_Password)
def register_user(user: User_Register, session = Depends(get_session)):
    try:
        data = user_service_instance_auth.register_user(user, session)
        return data
    except Exception as e:
        return {"error": str(e)}
    
@router.get("/{user_id}", response_model=User_Without_Password) #TODO : remplacer /{user_id} par /me (décripter le token JWT)
def get_user(user_id: int, session = Depends(get_session)):
    return user_service_instance_user.get_user(user_id, session)


# @router.post("/login", response_model=User_Without_Password)
# def authenticate_user(user: User_Register):
#     return user_service_instance.authenticate_user(user.email, user.password)