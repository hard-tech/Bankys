from fastapi import APIRouter, Depends, HTTPException
from app.auth.services.auth_service import user_service_instance_auth
from app.db.session import get_session
from app.auth.schemas.user import User_Register, User_Without_Password, User_login

router = APIRouter()

@router.post("/register", response_model=User_Without_Password)
def register_user(user: User_Register, session=Depends(get_session)):
    return user_service_instance_auth.register_user(user, session)

@router.post("/login")
def login(user: User_login, session=Depends(get_session)):
    authenticated_user = user_service_instance_auth.authenticate_user(user.email, user.password, session)
    if not authenticated_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = user_service_instance_auth.generate_token(authenticated_user)
    return {"token": token}

@router.get("/me")
def me(user=Depends(user_service_instance_auth.get_user)):
    return user