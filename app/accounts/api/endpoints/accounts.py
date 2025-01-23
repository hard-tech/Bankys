from fastapi import APIRouter, Depends, HTTPException, status
from app.accounts.schemas.account import Account_Add_Money
from app.db.session import get_session
from app.accounts.services.account_service import account_service_instance
from app.accounts.services.transaction_service import transaction_service_instance
from app.accounts.models.transaction import TransactionType

router = APIRouter()

@router.post("/create/{user_id}") # TODO: get user_id from token
def create_account(user_id: int, session=Depends(get_session)):
    try:
        return account_service_instance.create_account(user_id, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/close/{account_id}")
def close_account(account_id: int, session=Depends(get_session)):
    try:
        return account_service_instance.close_account(account_id, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{user_id}/accounts")
def get_accounts(user_id: int, session=Depends(get_session)):
    try:
        accounts = account_service_instance.get_accounts_of_user(user_id, session)
        if not accounts:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No accounts found for user")
        return accounts
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{account_id}")

def get_account(account_id: int, session=Depends(get_session)):
    try:
        account = account_service_instance.get_info_account_id(account_id, session)
        if not account:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
        return account
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
# @router.post("/{account_id}/deposit/{amount}")
# def add_money(account_id: int, amount: float, session=Depends(get_session)):
#     try:
#         deposit = Account_Add_Money(account_id_from=account_id, account_id_to=account_id, amount=amount)
#         return transaction_service_instance.transfert_money(deposit, TransactionType.DEPOSIT, session)
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
#     except ValueError as e:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))