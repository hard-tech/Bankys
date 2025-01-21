from pydantic import BaseModel


class ExempleItem(BaseModel):
    name: str
    description: str
    price: float
    tax: float