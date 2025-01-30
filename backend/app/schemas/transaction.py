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

class DepositRequest(BaseModel):
    account_iban: str
    amount: float
    transaction_note: str  # Ajout du champ transaction_note

class WithdrawalRequest(BaseModel):
    account_iban: str
    amount: float
    transaction_note: str  # Ajout du champ transaction_note

class TransferRequest(BaseModel):
    account_iban_from: str
    account_iban_to: str
    amount: float
    transaction_note: str  # Ajout du champ transaction_note
# Output models
class Transaction(BaseModel):
    transaction_id: int
    account_from: Account_Info
    account_to: Account_Info
    type: str
    amount: float
    created_at: dateTime