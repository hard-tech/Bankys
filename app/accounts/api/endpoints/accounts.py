from fastapi import APIRouter, Depends, status
from app.db.session import get_session
from app.accounts.services.account_service import account_service_instance
from app.auth.services.auth_service import user_service_instance_auth
from app.core.exceptions import CustomHTTPException

router = APIRouter()

@router.post("/create")
def create_account(session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Crée un nouveau compte pour l'utilisateur actuel.
    """
    try:
        return account_service_instance.create_account(user_id, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du compte.",
            error_code="CREATE_ACCOUNT_ERROR"
        )

@router.get("/get-all-accounts")
def get_accounts(session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Récupère tous les comptes de l'utilisateur actuel.
    """
    try:
        return account_service_instance.get_accounts_of_user(user_id, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des comptes.",
            error_code="GET_ACCOUNTS_ERROR"
        )

@router.post("/close/{account_id}")
def close_account(account_id: int, session=Depends(get_session)):
    """
    Ferme le compte spécifié par l'ID.
    """
    try:
        return account_service_instance.close_account(account_id, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la fermeture du compte.",
            error_code="CLOSE_ACCOUNT_ERROR"
        )

@router.get("/{account_id}")
def get_account(account_id: int, session=Depends(get_session)):
    """
    Récupère les informations du compte spécifié par l'ID.
    """
    try:
        account = account_service_instance.get_info_account_id(account_id, session)
        return account
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des informations du compte.",
            error_code="GET_ACCOUNT_INFO_ERROR"
        )