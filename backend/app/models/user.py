from pydantic import EmailStr
from sqlalchemy import Column, VARCHAR
from sqlmodel import Field, Relationship, SQLModel
# from models.account import Account

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: EmailStr = Field(sa_column=Column("email", VARCHAR, unique=True))
    password: str
    first_name: str
    last_name: str