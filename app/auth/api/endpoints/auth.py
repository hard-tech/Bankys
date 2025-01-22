from fastapi import APIRouter, Depends
from app.auth.schemas.user import User_Register, User_Without_Password
from app.auth.services.user_service import user_service_instance
from app.db.session import get_session

router = APIRouter()

@router.post("/register", response_model=User_Without_Password)
def register_user(user: User_Register, session = Depends(get_session)):

    try:
        data = user_service_instance.register_user(user, session)
        return data
    except Exception as e:
        return {"error": str(e)}

# @router.post("/login", response_model=User_Without_Password)
# def authenticate_user(user: User_Register):
#     return user_service_instance.authenticate_user(user.email, user.password)