from pydantic import BaseModel
from datetime import datetime as dateTime
from app.schemas.account import Account_Info


# Input models
class Transaction_Get_Account_Transaction(BaseModel):
    account_iban: int

class Transaction_Cancel_Transaction(BaseModel):
    transaction_id: int
    dateTime: dateTime

class Transaction_Get_Transaction_Info(BaseModel):
    transaction_id: int

from pydantic import BaseModel

class DepositRequest(BaseModel):
    account_iban: str
    amount: float

class WithdrawalRequest(BaseModel):
    account_iban: str
    amount: float

class TransferRequest(BaseModel):
    account_iban_from: str
    account_iban_to: str
    amount: float
# Output models
class Transaction(BaseModel):
    transaction_id: int
    account_from: Account_Info
    account_to: Account_Info
    type: str
    amount: float
    created_at: dateTime