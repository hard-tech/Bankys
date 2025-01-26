from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from enum import Enum

class TransactionType(str, Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    TRANSFER = "TRANSFER"

class TransactionStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"

class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")  # Assuming there is a user table with an id column
    account_from_iban: Optional[int] = Field(default=None, foreign_key="account.iban")
    account_to_iban: Optional[int] = Field(default=None, foreign_key="account.iban")
    amount: float
    type: TransactionType
    status: TransactionStatus = Field(default=TransactionStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)