from fastapi import APIRouter, Depends, HTTPException, status
from app.accounts.schemas.account import Account_Add_Money
from app.db.session import get_session
from app.accounts.services.transaction_service import transaction_service_instance
from app.accounts.models.transaction import TransactionType

router = APIRouter()

@router.post("/{account_id}/deposit/{amount}")
def add_money(account_id: int, amount: float, session=Depends(get_session)):
    try:
        deposit = Account_Add_Money(account_id_from=account_id, account_id_to=account_id, amount=amount)
        return transaction_service_instance.transfert_money(deposit, TransactionType.DEPOSIT, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.post("/{account_id}/withdrawal/{amount}")
def withdraw_money(account_id: int, amount: float, session=Depends(get_session)):
    try:
        withdrawal = Account_Add_Money(account_id_from=account_id, account_id_to=account_id, amount=amount)
        return transaction_service_instance.transfert_money(withdrawal, TransactionType.WITHDRAWAL, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.post("/{account_id_from}/transfer/{account_id_to}/{amount}")
def transfer_money(account_id_from: int, account_id_to: int, amount: float, session=Depends(get_session)):
    try:
        transfer = Account_Add_Money(account_id_from=account_id_from, account_id_to=account_id_to, amount=amount)
        return transaction_service_instance.transfert_money(transfer, TransactionType.TRANSFER, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))