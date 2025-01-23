from fastapi import FastAPI, Depends
from app.auth.api.endpoints import auth
from app.accounts.models.account import Account
from app.accounts.models.transaction import Transaction
from app.accounts.models.beneficiaire import Beneficiaire
from app.accounts.api.endpoints import accounts, beneficiaires, transactions
from app.db.session import create_db_and_tables
from app.auth.services.auth_service import user_service_instance_auth


import asyncio
from fastapi import FastAPI
from app.db.session import create_db_and_tables
from app.accounts.services.transaction_service import refresh_transactions

app = FastAPI()

# Initialize the database and create tables if they don't exist
@app.on_event("startup")

# Secure the /account and /transactions routes
account_router = accounts.router
transaction_router = transactions.router
beneficiaires_router = beneficiaires.router


async def on_startup():
    """
    Initialise la base de données et démarre les tâches asynchrones au démarrage de l'application.
    """
    create_db_and_tables()  # Crée les tables dans la base de données
    asyncio.create_task(refresh_transactions())  # Lancer la tâche de vérification des transactions PENDING

# Inclusion des routers pour les différentes fonctionnalités
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(account_router, prefix="/account", tags=["accounts"])
app.include_router(transaction_router, prefix="/transactions", tags=["transactions"])
app.include_router(beneficiaires_router, prefix="/beneficiaires", tags=["beneficiaires"])