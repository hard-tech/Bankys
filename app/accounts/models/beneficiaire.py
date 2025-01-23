from datetime import datetime
from sqlmodel import Field, SQLModel

class Beneficiaire(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    beneficiary_sender: int = Field(foreign_key="user.id")
    beneficiary_receiver: int = Field(foreign_key="user.id")
    name_beneficiary_receiver : str
    iban_receveur: str
    created_at: datetime = Field(default_factory=datetime.utcnow)