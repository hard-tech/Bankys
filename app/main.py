from fastapi import FastAPI, Depends
from app.schemas.user import User_Register, User_Without_Password
from app.api.endpoints import users, accounts, transactions

app = FastAPI()


app.include_router(users.router, prefix="/users", tags=["users"])
# app.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
# app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])


@app.post("/register")
def register(user: User_Register):
    """
    Enregistre un nouvel utilisateur dans le système.
    """
    return {"message": "Utilisateur enregistré", "user": user}


@app.post("/login")
def login(user: User_Register):
    """
    Authentifie un utilisateur.
    """
    return {"message": "Connexion réussie", "user": user}


@app.post("/account/create")
def create_account(user_id: int):
    """
    Crée un nouveau compte bancaire pour un utilisateur.
    """
    return {"message": f"Compte créé pour l'utilisateur {user_id}"}


@app.get("/account/{account_id}")
def read_account(account_id: int):
    """
    Retourne les informations d'un compte spécifique.
    """
    return {"account_id": account_id, "balance": 100.0}


@app.post("/account/{account_id}/add_money")
def add_money(account_id: int, amount: float):
    """
    Ajoute de l'argent à un compte bancaire.
    """
    return {"message": f"{amount} ajouté au compte {account_id}"}


@app.post("/account/{account_id}/transfer_money")
def transfer_money(account_id: int, amount: float, recipient_id: int):
    """
    Transfère de l'argent d'un compte à un autre.
    """
    return {
        "message": f"{amount} transféré du compte {account_id} au compte {recipient_id}"
    }


@app.get("/account/{account_id}/history")
def get_account_history(account_id: int):
    """
    Retourne l'historique des transactions d'un compte.
    """
    return {"account_id": account_id, "history": []}


@app.get("/accounts")
def get_accounts():
    """
    Retourne tous les comptes d'un utilisateur.
    """
    return [{"account_id": 1, "balance": 100.0}, {"account_id": 2, "balance": 200.0}]


@app.post("/transaction/{transaction_id}/cancel")
def cancel_transaction(transaction_id: int):
    """
    Annule une transaction spécifique.
    """
    return {"message": f"Transaction {transaction_id} annulée"}


@app.patch("/account/{account_id}/close")
def close_account(account_id: int):
    """
    Ferme un compte bancaire.
    """
    return {"message": f"Compte {account_id} fermé"}


@app.get("/transaction/{transaction_id}")
def read_transaction(transaction_id: int):
    """
    Retourne les détails d'une transaction spécifique.
    """
    return {"transaction_id": transaction_id, "amount": 50.0}


@app.post("/account/{account_id}/withdraw_money")
def withdraw_money(account_id: int, amount: float):
    """
    Retire de l'argent d'un compte bancaire.
    """
    return {"message": f"{amount} retiré du compte {account_id}"}
