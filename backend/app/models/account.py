from datetime import datetime
from sqlmodel import Field, SQLModel

# from models.user import User

class Account(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    balance: float = Field(default=0)
    iban: str
    user_id: int = Field(foreign_key="user.id")  # La clé étrangère pointe vers `user.id`
    actived: bool = Field(default=True)
    main: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

    