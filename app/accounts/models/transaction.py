from datetime import datetime
from typing import Optional
from enum import Enum
from sqlmodel import Field, Relationship, SQLModel


class TransactionType(str, Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    TRANSFER = "TRANSFER"

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    account_from_id: int = Field(foreign_key="account.id")  # Clé étrangère vers le compte émetteur
    account_to_id: int = Field(foreign_key="account.id")    # Clé étrangère vers le compte destinataire
    type: TransactionType  # Type de transaction: dépôt ou retrait
    amount: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # account_from: Optional["Account"] = Relationship(sa_relationship_kwargs={"foreign_keys": "Transaction.account_from_id"})
    # account_to: Optional["Account"] = Relationship(sa_relationship_kwargs={"foreign_keys": "Transaction.account_to_id"})
