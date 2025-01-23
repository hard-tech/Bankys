from pydantic import BaseModel


class Create_Beneficiaire(BaseModel):
    beneficiaire_envoyeur: int
    beneficiaire_receveur: int