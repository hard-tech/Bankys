from pydantic import BaseModel
from datetime import datetime as dateTime
from app.accounts.schemas.account import Account_Info


# Input models
class Transaction_Get_Account_Transaction(BaseModel):
    account_id: int

class Transaction_Cancel_Transaction(BaseModel):
    transaction_id: int
    dateTime: dateTime

class Transaction_Get_Transaction_Info(BaseModel):
    transaction_id: int

# Output models
class Transaction(BaseModel):
    transaction_id: int
    account_from: Account_Info
    account_to: Account_Info
    amount: float
    created_at: dateTime