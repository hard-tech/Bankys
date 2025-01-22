from pydantic import BaseModel
from datetime import datetime as dateTime
from app.auth.schemas.user import User_Without_Password


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
    user_from: User_Without_Password
    user_to: User_Without_Password
    amount: float
    created_at: dateTime