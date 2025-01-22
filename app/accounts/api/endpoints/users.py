from fastapi import APIRouter, Depends
from app.schemas.user import User_Register, User_Without_Password
from app.services.user_service import user_service_instance
from app.db.session import get_session

router = APIRouter()

@router.post("/register", response_model=User_Without_Password)
def register_user(user: User_Register, session = Depends(get_session)):

    try:
        data = user_service_instance.register_user(user, session)
        return data
    except Exception as e:

        # if 

        return {"error": str(e)}

@router.get("/{user_id}", response_model=User_Without_Password)
def get_user(user_id: int, session = Depends(get_session)):
    return user_service_instance.get_user(user_id, session)

# @router.post("/login", response_model=User_Without_Password)
# def authenticate_user(user: User_Register):
#     return user_service_instance.authenticate_user(user.email, user.password)