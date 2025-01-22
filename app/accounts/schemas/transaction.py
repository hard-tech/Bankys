from pydantic import BaseModel
from datetime import datetime as dateTime
from user import User_transaction


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
    user_from: User_transaction
    user_to: User_transaction
    amount: float
    created_at: dateTime