from typing import List
from pydantic import EmailStr
from sqlalchemy import Column, VARCHAR
from sqlmodel import Field, Relationship, SQLModel
# from app.models.account import Account

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: EmailStr = Field(sa_column=Column("email", VARCHAR, unique=True))
    password: str
    first_name: str
    last_name: str
    accounts: List["Account"] = Relationship(back_populates="user")  # Chaîne différée pour éviter les problèmes de circular import