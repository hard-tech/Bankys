from fastapi import APIRouter, Depends
from app.db.session import get_session
from app.accounts.services.account_service import account_service_instance

router = APIRouter()


@router.post("/create")
def create_account(session = Depends(get_session)):
    return account_service_instance.create_account(1, session)