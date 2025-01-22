from fastapi import APIRouter, Depends
from app.db.session import get_session
from app.accounts.services.account_service import account_service_instance

router = APIRouter()


@router.post("/create/{user_id}")
def create_account(user_id : int, session = Depends(get_session)):
    return account_service_instance.create_account(user_id, session)

@router.post("/close/{account_id}")
def close_account(account_id : int, session = Depends(get_session)):
    return account_service_instance.close_account(account_id, session)