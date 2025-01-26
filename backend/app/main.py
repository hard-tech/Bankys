from fastapi import FastAPI, Depends
import asyncio

from app.routes import auth 
from app.routes import accounts, beneficiaires, transactions
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.beneficiaire import Beneficiaire
from app.services.auth_service import user_service_instance_auth
from app.services.transaction_service import refresh_transactions
from app.database.session import create_db_and_tables

app = FastAPI()



# Initialize the database and create tables if they don't exist
# Secure the /account and /transactions routes
account_router = accounts.router
transaction_router = transactions.router
beneficiaires_router = beneficiaires.router

@app.on_event("startup")
async def on_startup():
    """
    Initialise la base de données et démarre les tâches asynchrones au démarrage de l'application.
    """
    create_db_and_tables()  # Crée les tables dans la base de données
    asyncio.create_task(refresh_transactions())  # Lancer la tâche de vérification des transactions PENDING

# Inclusion des routers pour les différentes fonctionnalités
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(account_router, prefix="/account", tags=["accounts"], dependencies=[Depends(user_service_instance_auth.get_current_user_id)])
app.include_router(transaction_router, prefix="/transactions", tags=["transactions"], dependencies=[Depends(user_service_instance_auth.get_current_user_id)])
app.include_router(beneficiaires_router, prefix="/beneficiaires", tags=["beneficiaires"], dependencies=[Depends(user_service_instance_auth.get_current_user_id)])