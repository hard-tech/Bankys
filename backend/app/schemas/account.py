from pydantic import BaseModel


class Account_Creat(BaseModel):
    owner_id: int

class Account_Get_Info(BaseModel):
    account_id: int

class Account_Add_Money(BaseModel):
    account_iban_from: str
    account_iban_to: str
    amount: float
    transaction_note: str

class Account_Transfer_Money(BaseModel):
    account_id: int
    amount: float
    recipient_account_id: int


class Account_Close(BaseModel):
    account_id: int

class Account_Info(BaseModel):
    id: int | None
    balance: float
    iban: str
    user_id: int
    actived: bool
    name: str
    main: bool

class Get_Accounts(BaseModel):
    id: int | None
    balance: float
    iban: str
    name: str
   
class AccountIdRequest(BaseModel):
    account_id: int

class CreateAccountRequest(BaseModel):
    account_name: str