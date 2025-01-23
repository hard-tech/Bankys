from fastapi import APIRouter, Depends, status
from app.accounts.services.beneficiaire_service import beneficiaire_service_instance
from app.auth.services.auth_service import user_service_instance_auth
from app.db.session import get_session
from app.core.exceptions import CustomHTTPException

router = APIRouter()

@router.post("/create/{account_id_to}/{beneficiary_name}")
def create_beneficiaire(account_id_to: int, beneficiary_name: str, user_id_envoyeur=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Crée un nouveau bénéficiaire pour l'utilisateur actuel.
    """
    try:
        return beneficiaire_service_instance.create_beneficiaire(user_id_envoyeur, beneficiary_name, account_id_to, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du bénéficiaire.",
            error_code="CREATE_BENEFICIAIRE_ERROR"
        )

@router.get("/get_all_beneficiaires")
def get_all_beneficiaires(user_id=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Récupère tous les bénéficiaires de l'utilisateur actuel.
    """
    try:
        return beneficiaire_service_instance.get_benificiaires_of_user(user_id, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des bénéficiaires.",
            error_code="GET_BENEFICIAIRES_ERROR"
        )