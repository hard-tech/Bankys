from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from enum import Enum

class TransactionType(str, Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    TRANSFER = "TRANSFER"

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    account_from_id: Optional[int] = Field(default=None, foreign_key="account.id")
    account_to_id: Optional[int] = Field(default=None, foreign_key="account.id")
    amount: float
    type: TransactionType
    created_at: datetime = Field(default_factory=datetime.utcnow)