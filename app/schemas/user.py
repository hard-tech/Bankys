from pydantic import BaseModel


# Input models
class User_Register(BaseModel):
    email: str
    password: str
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
    user_id: int
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

