from fastapi import FastAPI

from app.auth.schemas.user import User_Register
from app.auth.models.user import User
from app.auth.api.endpoints import auth
from app.auth.api.endpoints import auth

from app.accounts.models.account import Account
from app.accounts.models.transaction import Transaction
from app.accounts.models.beneficiaire import Beneficiaire

from app.accounts.api.endpoints import accounts, beneficiaires, transactions

from app.db.session import create_db_and_tables


import asyncio
from fastapi import FastAPI
from app.db.session import create_db_and_tables
from app.accounts.services.transaction_service import refresh_transactions

app = FastAPI()

# Initialize the database and create tables if they don't exist
@app.on_event("startup")
async def on_startup():
    """
    Initialise la base de données et démarre les tâches asynchrones au démarrage de l'application.
    """
    create_db_and_tables()  # Crée les tables dans la base de données
    asyncio.create_task(refresh_transactions())  # Lancer la tâche de vérification des transactions PENDING

# Inclusion des routers pour les différentes fonctionnalités
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(accounts.router, prefix="/account", tags=["accounts"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(beneficiaires.router, prefix="/beneficiaires", tags=["beneficiaires"])
# app.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
# app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])


# @app.post("/account/{account_id}/transfer_money")
# def transfer_money(account_id: int, amount: float, recipient_id: int):
#     """
#     Transfère de l'argent d'un compte à un autre.
#     """
#     return {
#         "message": f"{amount} transféré du compte {account_id} au compte {recipient_id}"
#     }


# @app.get("/account/{account_id}/history")
# def get_account_history(account_id: int):
#     """
#     Retourne l'historique des transactions d'un compte.
#     """
#     return {"account_id": account_id, "history": []}


# @app.get("/accounts")
# def get_accounts():
#     """
#     Retourne tous les comptes d'un utilisateur.
#     """
#     return [{"account_id": 1, "balance": 100.0}, {"account_id": 2, "balance": 200.0}]


# @app.post("/transaction/{transaction_id}/cancel")
# def cancel_transaction(transaction_id: int):
#     """
#     Annule une transaction spécifique.
#     """
#     return {"message": f"Transaction {transaction_id} annulée"}


# @app.patch("/account/{account_id}/close")
# def close_account(account_id: int):
#     """
#     Ferme un compte bancaire.
#     """
#     return {"message": f"Compte {account_id} fermé"}


# @app.get("/transaction/{transaction_id}")
# def read_transaction(transaction_id: int):
#     """
#     Retourne les détails d'une transaction spécifique.
#     """
#     return {"transaction_id": transaction_id, "amount": 50.0}


# @app.post("/account/{account_id}/withdraw_money")
# def withdraw_money(account_id: int, amount: float):
#     """
#     Retire de l'argent d'un compte bancaire.
#     """
#     return {"message": f"{amount} retiré du compte {account_id}"}
