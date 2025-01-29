from fastapi import APIRouter, Depends, status
from app.database.session import get_session
from app.services.account_service import account_service_instance
from app.services.auth_service import user_service_instance_auth
from app.utils.exceptions import CustomHTTPException
from app.schemas.account import AccountIdRequest, CreateAccountRequest

router = APIRouter()

@router.post("/create")
def create_account(
    request: CreateAccountRequest,
    session=Depends(get_session),
    user_id=Depends(user_service_instance_auth.get_current_user_id)
):
    """
    Crée un nouveau compte pour l'utilisateur actuel.
    """
    try:
        return account_service_instance.create_account(user_id, request.account_name, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du compte.",
            error_code="CREATE_ACCOUNT_ERROR"
        )

@router.get("/get/all")
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

@router.delete("/close/{account_request}")
def close_account(account_request: int, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Ferme le compte spécifié par l'ID.
    """
    try:
        return account_service_instance.close_account(account_request, user_id, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la fermeture du compte.",
            error_code="CLOSE_ACCOUNT_ERROR"
        )

@router.post("/info")
def get_account(account_request: AccountIdRequest, session=Depends(get_session), user_id=Depends(user_service_instance_auth.get_current_user_id)):
    """
    Récupère les informations du compte spécifié par l'ID.
    """
    try:
        account = account_service_instance.get_info_account_id(user_id, account_request.account_id, session)
        return account
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des informations du compte.",
            error_code="GET_ACCOUNT_INFO_ERROR"
        )