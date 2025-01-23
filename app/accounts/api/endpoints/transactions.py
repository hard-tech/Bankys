from fastapi import APIRouter, Depends, HTTPException, status
from app.accounts.schemas.account import Account_Add_Money
from app.db.session import get_session
from app.accounts.services.transaction_service import transaction_service_instance
from app.accounts.models.transaction import TransactionType

router = APIRouter()

@router.post("/{account_iban}/deposit/{amount}")
def add_money(account_iban: str, amount: float, session=Depends(get_session)):
    try:
        deposit = Account_Add_Money(account_iban_from=account_iban, account_iban_to=account_iban, amount=amount)
        return transaction_service_instance.transfert_money(deposit, TransactionType.DEPOSIT, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.post("/{account_iban}/withdrawal/{amount}")
def withdraw_money(account_iban: str, amount: float, session=Depends(get_session)):
    try:
        withdrawal = Account_Add_Money(account_iban_from=account_iban, account_iban_to=account_iban, amount=amount)
        return transaction_service_instance.transfert_money(withdrawal, TransactionType.WITHDRAWAL, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.post("/{account_iban_from}/transfer/{account_iban_to}/{amount}")
def transfer_money(account_iban_from: str, account_iban_to: str, amount: float, session=Depends(get_session)):
    try:
        transfer = Account_Add_Money(account_iban_from=account_iban_from, account_iban_to=account_iban_to, amount=amount)
        return transaction_service_instance.transfert_money(transfer, TransactionType.TRANSFER, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.get("/{transaction_id}")
def get_transaction(transaction_id: int, session=Depends(get_session)):
    try:
        transaction = transaction_service_instance.get_transaction(transaction_id, session)
        if not transaction:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        return transaction
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("/get/{user_id}")
def get_transactions_by_user(user_id: int, session=Depends(get_session)):
    try:
        transactions = transaction_service_instance.get_transactions_by_user(user_id, session)
        return transactions
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))