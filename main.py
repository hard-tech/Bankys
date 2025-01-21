from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()

class ExempleItem(BaseModel):
    name: str
    description: str
    price: float
    tax: float

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur FastAPI!"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}


@app.get("/app_name")
def read_app_name(app_name: str = Depends(get_app_name)):
    return {"app_name": app_name}