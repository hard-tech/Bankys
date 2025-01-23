from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.accounts.schemas.account import Account_Add_Money
from app.db.session import get_session
from app.accounts.services.transaction_service import transaction_service_instance
from app.accounts.models.transaction import TransactionType
from app.auth.services.auth_service import user_service_instance_auth

router = APIRouter()

@router.post("/{account_iban}/deposit/{amount}")
def add_money(account_iban: str, amount: float, session=Depends(get_session)):
    """
    Dépose de l'argent sur le compte spécifié par l'IBAN.
    """
    try:
        deposit = Account_Add_Money(account_iban_from=account_iban, account_iban_to=account_iban, amount=amount)
        return transaction_service_instance.transfert_money(deposit, TransactionType.DEPOSIT, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Erreur: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors du dépôt: {str(e)}")

@router.post("/{account_iban}/withdrawal/{amount}")
def withdraw_money(account_iban: str, amount: float, session=Depends(get_session)):
    """
    Retire de l'argent du compte spécifié par l'IBAN.
    """
    try:
        withdrawal = Account_Add_Money(account_iban_from=account_iban, account_iban_to=account_iban, amount=amount)
        return transaction_service_instance.transfert_money(withdrawal, TransactionType.WITHDRAWAL, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Erreur: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors du retrait: {str(e)}")

@router.post("/{account_iban_from}/transfer/{account_iban_to}/{amount}")
def transfer_money(account_iban_from: str, account_iban_to: str, amount: float, session=Depends(get_session)):
    """
    Transfère de l'argent d'un compte à un autre.
    """
    try:
        transfer = Account_Add_Money(account_iban_from=account_iban_from, account_iban_to=account_iban_to, amount=amount)
        return transaction_service_instance.transfert_money(transfer, TransactionType.TRANSFER, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Erreur: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors du transfert: {str(e)}")

@router.get("/info/{transaction_id}")
def get_transaction(transaction_id: int, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Récupère les détails d'une transaction spécifique par ID.
    """
    try:
        transaction = transaction_service_instance.get_transaction(transaction_id, session, user_id)
        if not transaction:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction non trouvée")
        return transaction
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors de la récupération de la transaction: {str(e)}")

@router.get("/get-all-transactions")
def get_transactions_by_user(user_id=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Récupère toutes les transactions pour un utilisateur spécifique.
    """
    try:
        transactions = transaction_service_instance.get_transactions_by_user(user_id, session)
        return transactions
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors de la récupération des transactions: {str(e)}")

@router.post("/cancel/{transaction_id}")
def cancel_transaction(transaction_id: int, session: Session = Depends(get_session)):
    """
    Endpoint pour annuler une transaction.
    """
    try:
        return transaction_service_instance.cancel_transaction(transaction_id, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors de l'annulation de la transaction: {str(e)}")