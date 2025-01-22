from fastapi import Depends
from sqlmodel import Session
from app.accounts.schemas.account import *
from app.db.session import get_session
from app.accounts.models.account import Account
import random

def generate_iban(session : Session) ->str:
        while True:
            # Générer un IBAN aléatoire avec un préfixe fixe.
            iban = f"FAKE{random.randint(1000000000, 9999999999)}"
            
            # Vérifier si l'IBAN existe déjà dans la base de données.
            if not session.query(Account).filter_by(iban=iban).first():
                return iban


class AccountService:

    def create_principal_account(user_id: int, session : Session) -> Account:
        account = Account(sold=100, iban="princIban", user_id = user_id, status = True, main = True)
        session.add(account)
        session.commit()
        session.refresh(account)
        return account

    def create_account(self, user_id: int, session : Session) -> Account:
        account = Account(sold=0, iban=generate_iban(session), user_id = user_id, status = True, main = False)
        session.add(account)
        session.commit()
        session.refresh(account)
        return account

    



account_service_instance = AccountService()