from fastapi import APIRouter, Depends
from app.schemas.user import User_Register, User_Without_Password
from app.services.user_service import user_service_instance

router = APIRouter()

# @router.post("/register", response_model=User_Without_Password)
# def register_user(user: User_Register):
#     return user_service_instance.register_user(user)

@router.get("/{user_id}", response_model=User_Without_Password)
def get_user(user_id: int):
    return user_service_instance.get_user(user_id)

# @router.post("/login", response_model=User_Without_Password)
# def authenticate_user(user: User_Register):
#     return user_service_instance.authenticate_user(user.email, user.password)