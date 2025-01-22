from fastapi import Depends
from app.schemas.account import *
from app.db.session import get_session
from app.models.account import Account

def create_principal_account(user_id: int, session = Depends(get_session)) -> Account:
    account = Account(sold=100, iban="iban", user_id = user_id, status = True, main = True)
    session.add(account)
    session.commit()
    session.refresh(account)
    return account