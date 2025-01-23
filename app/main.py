from fastapi import FastAPI, Depends
from app.auth.api.endpoints import auth
from app.accounts.api.endpoints import accounts, transactions
from app.db.session import create_db_and_tables
from app.auth.services.auth_service import user_service_instance_auth

app = FastAPI()

# Initialize the database and create tables if they don't exist
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Secure the /account and /transactions routes
account_router = accounts.router
transaction_router = transactions.router

# account_router.dependencies.append(Depends(user_service_instance_auth.get_current_user))
# transaction_router.dependencies.append(Depends(user_service_instance_auth.get_current_user))

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(account_router, prefix="/account", tags=["accounts"])
app.include_router(transaction_router, prefix="/transactions", tags=["accounts"])