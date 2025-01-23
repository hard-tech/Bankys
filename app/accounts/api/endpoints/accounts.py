from fastapi import APIRouter, Depends, HTTPException, status
from app.accounts.schemas.account import Account_Add_Money
from app.db.session import get_session
from app.accounts.services.account_service import account_service_instance
from app.accounts.services.transaction_service import transaction_service_instance
from app.accounts.models.transaction import TransactionType
from app.auth.services.auth_service import user_service_instance_auth

router = APIRouter()

@router.post("/create")
def create_account(session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Crée un nouveau compte pour l'utilisateur actuel.
    """
    try:
        return account_service_instance.create_account(user_id, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors de la création du compte: {str(e)}")

@router.get("/get-all-accounts")
def get_accounts(session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Récupère tous les comptes de l'utilisateur actuel.
    """
    try:
        return account_service_instance.get_accounts_of_user(user_id, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors de la récupération des comptes: {str(e)}")

@router.post("/close/{account_id}")
def close_account(account_id: int, session=Depends(get_session)):
    """
    Ferme le compte spécifié par l'ID.
    """
    try:
        return account_service_instance.close_account(account_id, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors de la fermeture du compte: {str(e)}")

@router.get("/{account_id}")
def get_account(account_id: int, session=Depends(get_session)):
    """
    Récupère les informations du compte spécifié par l'ID.
    """
    try:
        account = account_service_instance.get_info_account_id(account_id, session)
        if not account:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compte non trouvé")
        return account
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erreur lors de la récupération du compte: {str(e)}")