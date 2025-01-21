from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import TypedDict

from app.schemas.account import ExempleItem


app = FastAPI()

@app.get("/")
def read_root(user: ExempleItem):
    return {"message": "Bienvenue sur FastAPI!"}


@app.post("/register")
def register(user: User):
    return {"message": "Utilisateur enregistré"}

@app.post("/login")
def login(user: User):
    User.id = user.id
    return {"message": "Connexion réussie"}

@app.get("/me")
def read_me(user: User = Depends(get_current_user)):
    return user

@app.post("/account/create")
def create_account(user: Account):
    return {"message": "Compte créé"}

@app.get("/account/{account_id}")
def read_account(account_id: int):
    return {"account_id": account_id}

@app.post("/account/{account_id}/add_money")
def add_money(account_id: int, amount: float):
    return {"message": f"Ajouté {amount} à l'account {account_id}"}

@app.post("/account/{account_id}/transfer_money")
def transfer_money(account_id: int, amount: float, recipient_id: int):
    return {"message": f"Transféré {amount} à l'account {recipient_id} de l'account {account_id}"}


@app.get("/account/{account_id}/history")
def get_account_history(account_id: int):
    return {"account_id": account_id, "history": []}

@app.get("/account")
def get_accounts():
    return [{"account_id": 1}, {"account_id": 2}]

@app.post("/transaction/{transaction_id}/cancel")
def cancel_transaction(transaction_id: int):
    return {"message": f"Annulé la transaction {transaction_id}"}

@app.patch("/account/{account_id}/close")
def close_account(account_id: int):
    return {"message": f"Fermé l'account {account_id}"}

@app.get("/transaction/{transaction_id}")
def read_transaction(transaction_id: int):
    return {"transaction_id": transaction_id}


@app.post("/account/{account_id}/withdraw_money")
def withdraw_money(account_id: int, amount: float):
    return {"message": f"Retiré {amount} de l'account {account_id}"}




# @app.get("/items/{item_id}")
# def read_item(item_id: int):
#     return {"item_id": item_id}


# config = {"version": "1.0.0", "name": "My API"}

# def get_config():
#     return config

# def get_app_name(config: Config = Depends(get_config)):
#     return config["name"]

# @app.get("/app_name")
# def read_app_name(app_name: str = Depends(get_app_name)):
#     return {"app_name": app_name}