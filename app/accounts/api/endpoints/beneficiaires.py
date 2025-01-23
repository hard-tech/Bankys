from fastapi import APIRouter, Depends, HTTPException
from app.accounts.services.beneficiaire_service import beneficiaire_service_instance
from app.auth.services.auth_service import user_service_instance_auth
from app.db.session import get_session

router = APIRouter()

@router.post("/create/{account_id_receveur}")
def create_beneficiaire(account_id_receveur: int, user_id_envoyeur=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Crée un nouveau bénéficiaire pour l'utilisateur actuel.
    """
    try:
        return beneficiaire_service_instance.create_beneficiaire(user_id_envoyeur, account_id_receveur, session)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors de la création du bénéficiaire: {str(e)}")

@router.get("/get_all_beneficiaires")
def get_all_beneficiaires(user_id=Depends(user_service_instance_auth.get_current_user_id), session=Depends(get_session)):
    """
    Récupère tous les bénéficiaires de l'utilisateur actuel.
    """
    try:
        return beneficiaire_service_instance.get_benificiaires_of_user(user_id, session)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors de la récupération des bénéficiaires: {str(e)}")