from pydantic import BaseModel


class Account_Creat(BaseModel):
    owner_id: int

class Account_Get_Info(BaseModel):
    account_id: int

class Account_Add_Money(BaseModel):
    account_id: int
    amount: float

class Account_Transfer_Money(BaseModel):
    account_id: int
    amount: float
    recipient_account_id: int

class Account_Get_Accounts(BaseModel):
    owner_id: int

class Account_Close(BaseModel):
    account_id: int

class Account(BaseModel):
    sold: float
    iban: str
    user_id: int
    status: bool