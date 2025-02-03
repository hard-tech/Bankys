from pydantic import BaseModel

# Input models
from pydantic import BaseModel, EmailStr

class User_Register(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class User_login(BaseModel):
    email: EmailStr
    password: str

class User_Without_Password(BaseModel):
    id: int | None
    email: EmailStr
    first_name: str
    last_name: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

# class User(BaseModel):
#     user_id: int
#     email: str
#     first_name: str
#     last_name: str
#     password: str
#     accounts: Account