from typing import Optional
from sqlmodel import Field, Relationship, SQLModel

class Account(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sold: float = Field(default=0)
    iban: str
    user_id: int = Field(foreign_key="user.id")  # La clé étrangère pointe vers `user.id`
    status: bool
    user: Optional["User"] = Relationship(back_populates="accounts")  # Chaîne différée pour éviter les problèmes de circular import
