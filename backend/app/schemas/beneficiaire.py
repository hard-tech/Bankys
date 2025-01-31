from datetime import datetime
from pydantic import BaseModel

class Get_Beneficiaires(BaseModel):
    id: int | None
    name : str
    iban : str
    date : datetime

class BeneficiaireCreateRequest(BaseModel):
    iban: str
    name: str