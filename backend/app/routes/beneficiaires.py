from fastapi import APIRouter, Depends, status
from app.services.beneficiaire_service import beneficiaire_service_instance
from app.services.auth_service import user_service_instance_auth
from app.database.session import get_session
from app.utils.exceptions import CustomHTTPException
from app.schemas.beneficiaire import BeneficiaireCreateRequest

router = APIRouter()

@router.post("/create")
def create_beneficiaire(request: BeneficiaireCreateRequest, user_id_envoyeur=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Crée un nouveau bénéficiaire pour l'utilisateur actuel.
    """
    try:
        return beneficiaire_service_instance.create_beneficiaire(user_id_envoyeur, request.name, request.iban, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du bénéficiaire.",
            error_code="CREATE_BENEFICIAIRE_ERROR"
        )
    
@router.delete("/delete/{beneficiaire_id}")
def delete_beneficiaire(beneficiaire_id: int, user_id=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Supprime un bénéficiaire de l'utilisateur actuel.
    """
    try:
        return beneficiaire_service_instance.delete_beneficiaire(user_id, beneficiaire_id, session)
    except CustomHTTPException as e:
        raise e
    except Exception as e:
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la suppression du bénéficiaire.",
            error_code="DELETE_BENEFICIAIRE_ERROR"
        )

@router.get("/get/all")
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