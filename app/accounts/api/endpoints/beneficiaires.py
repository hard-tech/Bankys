from fastapi import APIRouter, Depends, HTTPException
from app.accounts.services.beneficiaire_service import beneficiaire_service_instance

from app.db.session import get_session


router = APIRouter()

@router.post("/create/{user_id_envoyeur}/{account_id_receveur}")
def create_beneficiaire(user_id_envoyeur: int, account_id_receveur : int, session=Depends(get_session)):
    return beneficiaire_service_instance.create_beneficiaire(user_id_envoyeur, account_id_receveur, session)

@router.post("/get_all_beneficiaires/{user_id}")
def get_all_beneficiaires(user_id: int, session=Depends(get_session)):
    return beneficiaire_service_instance.get_benificiaires_of_user(user_id, session)