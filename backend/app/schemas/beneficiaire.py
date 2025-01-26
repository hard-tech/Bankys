from datetime import datetime
from pydantic import BaseModel

class Get_Beneficiaires(BaseModel):
    id: int | None
    name : str
    iban : str
    date : datetime

class BeneficiaireCreateRequest(BaseModel):
    account_id_to: int
    beneficiary_name: str