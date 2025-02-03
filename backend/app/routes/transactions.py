import csv
from datetime import datetime
import io
from typing import Optional
from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlmodel import Session
from app.schemas.transaction import DepositRequest, WithdrawalRequest, TransferRequest
from app.database.session import get_session
from app.services.transaction_service import transaction_service_instance
from app.models.transaction import TransactionType
from app.services.auth_service import user_service_instance_auth
from app.utils.exceptions import CustomHTTPException
from app.schemas.account import Account_Add_Money

router = APIRouter()

@router.post("/deposit")
def add_money(request: DepositRequest, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Dépose de l'argent sur le compte spécifié par l'IBAN.
    """
    try:
        deposit = Account_Add_Money(
            account_iban_from=request.account_iban,
            account_iban_to=request.account_iban,
            amount=request.amount,
            transaction_note=request.transaction_note  # Utilisation de transaction_note
        )
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
        withdrawal = Account_Add_Money(
            account_iban_from=request.account_iban,
            account_iban_to=request.account_iban,
            amount=request.amount,
            transaction_note=request.transaction_note  # Utilisation de transaction_note
        )
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
        transfer = Account_Add_Money(
            account_iban_from=request.account_iban_from,
            account_iban_to=request.account_iban_to,
            amount=request.amount,
            transaction_note=request.transaction_note  # Utilisation de transaction_note
        )
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

@router.get("/get/all")
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

@router.get("/get/stats")
def get_transaction_stats(user_id=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Récupère les statistiques de transactions pour un utilisateur spécifique.
    """
    try:
        stats = transaction_service_instance.get_transaction_stats(user_id, session)
        return stats
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de la récupération des statistiques de transactions: {str(e)}",
            error_code="GET_STATS_ERROR"
        )

@router.delete("/cancel/{transaction_id}")
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
    

@router.get("/download-statement/{iban}")
def download_statement(
    iban: str,
    month: Optional[str] = None,
    session: Session = Depends(get_session),
    user_id: int = Depends(user_service_instance_auth.get_current_user_id)
):
    """
    Télécharge un relevé de compte au format CSV pour un IBAN et un mois spécifique (optionnel).
    """
    try:
        # Vérifier si l'utilisateur a accès à ce compte
        if not transaction_service_instance.user_owns_account(user_id, iban, session):
            raise CustomHTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas accès à ce compte",
                error_code="ACCOUNT_ACCESS_DENIED"
            )

        # Récupérer les transactions
        transactions = transaction_service_instance.get_transactions_for_statement(iban, month, session)

        # Créer un buffer en mémoire pour stocker le CSV
        output = io.StringIO()
        writer = csv.writer(output)

        # Écrire l'en-tête du CSV
        writer.writerow(['Date', 'Type', 'Montant', 'De', 'Vers', 'Description'])

        # Écrire les transactions dans le CSV
        for transaction in transactions:
            writer.writerow([
                transaction.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                transaction.type.value,
                f"{transaction.amount:.2f}",
                transaction.account_from_iban,
                transaction.account_to_iban,
                transaction.transaction_note
            ])

        # Préparer le fichier pour le téléchargement
        output.seek(0)

        # Générer un nom de fichier
        today = datetime.now().strftime('%Y-%m-%d')
        filename = f"releve_{iban}_{today}.csv"

        # Retourner le fichier CSV comme une réponse en streaming
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la génération du relevé: {str(e)}",
            error_code="STATEMENT_GENERATION_ERROR"
        )