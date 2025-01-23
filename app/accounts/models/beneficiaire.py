from datetime import datetime
from sqlmodel import Field, SQLModel

class Beneficiaire(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    beneficiaire_envoyeur: int = Field(foreign_key="user.id")
    beneficiaire_receveur: int = Field(foreign_key="user.id")
    name_beneficiaire_receveur : str = Field(foreign_key="user.first_name")
    iban_receveur: str
    created_at: datetime = Field(default_factory=datetime.utcnow)