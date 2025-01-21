from pydantic import BaseModel
from account import Account


# Input models
class User_Register(BaseModel):
    password: str
    email: str
    first_name: str
    last_name: str

class User_Login(BaseModel):
    email: str
    password: str


# Output models
class User_transaction(BaseModel):
    first_name: str
    last_name: str
    email: str

class User_Without_Password(BaseModel):
    email: str
    first_name: str
    last_name: str

# class User(BaseModel):
#     user_id: int
#     email: str
#     first_name: str
#     last_name: str
#     password: str
#     accounts: Account

