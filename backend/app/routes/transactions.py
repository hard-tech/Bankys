from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.schemas.transaction import DepositRequest, WithdrawalRequest, TransferRequest
from app.database.session import get_session
from app.services.transaction_service import transaction_service_instance
from app.models.transaction import TransactionType
from app.services.auth_service import user_service_instance_auth
from app.utils.exceptions import CustomHTTPException
from backend.app.schemas.account import Account_Add_Money

router = APIRouter()

@router.post("/deposit")
def add_money(request: DepositRequest, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Dépose de l'argent sur le compte spécifié par l'IBAN.
    """
    try:
        deposit = Account_Add_Money(account_iban_from=request.account_iban, account_iban_to=request.account_iban, amount=request.amount)
        return transaction_service_instance.transfert_money(user_id, deposit, TransactionType.DEPOSIT, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Une erreur s'est produite lors du dépôt: {str(e)}",
            error_code="DEPOSIT_ERROR"
        )

@router.post("/withdrawal")
def withdraw_money(request: WithdrawalRequest, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Retire de l'argent du compte spécifié par l'IBAN.
    """
    try:
        withdrawal = Account_Add_Money(account_iban_from=request.account_iban, account_iban_to=request.account_iban, amount=request.amount)
        return transaction_service_instance.transfert_money(user_id, withdrawal, TransactionType.WITHDRAWAL, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors du retrait: {str(e)}",
            error_code="WITHDRAWAL_ERROR"
        )

@router.post("/transfer")
def transfer_money(request: TransferRequest, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Transfère de l'argent d'un compte à un autre.
    """
    try:
        transfer = Account_Add_Money(account_iban_from=request.account_iban_from, account_iban_to=request.account_iban_to, amount=request.amount)
        return transaction_service_instance.transfert_money(user_id, transfer, TransactionType.TRANSFER, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors du transfert: {str(e)}",
            error_code="TRANSFER_ERROR"
        )

@router.get("/info/{transaction_id}")
def get_transaction(transaction_id: int, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Récupère les détails d'une transaction spécifique par ID.
    """
    try:
        transaction = transaction_service_instance.get_transaction(transaction_id, session, user_id)
        if not transaction:
            raise CustomHTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction non trouvée",
                error_code="TRANSACTION_NOT_FOUND"
            )
        return transaction
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de la récupération de la transaction: {str(e)}",
            error_code="GET_TRANSACTION_ERROR"
        )

@router.get("/get-all-transactions")
def get_transactions_by_user(user_id=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Récupère toutes les transactions pour un utilisateur spécifique.
    """
    try:
        transactions = transaction_service_instance.get_transactions_by_user(user_id, session)
        return transactions
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de la récupération des transactions: {str(e)}",
            error_code="GET_ALL_TRANSACTIONS_ERROR"
        )

@router.post("/cancel/{transaction_id}")
def cancel_transaction(transaction_id: int, session: Session = Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Endpoint pour annuler une transaction.
    """
    try:
        return transaction_service_instance.cancel_transaction(user_id, transaction_id, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de l'annulation de la transaction: {str(e)}",
            error_code="CANCEL_TRANSACTION_ERROR"
        )