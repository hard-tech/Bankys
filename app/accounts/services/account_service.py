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

    def create_principal_account(self, user_id: int, session : Session) -> Account:
        account = Account(sold=100, iban=generate_iban(session), user_id = user_id, status = True, main = True)
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

    def close_account(self, account_id: int, session: Session) -> Account:
        # Récupérer le compte en fonction de l'ID
        account = session.query(Account).filter_by(id=account_id).first()

        # Vérifier si le compte existe
        if not account:
            raise ValueError(f"Le compte avec l'ID {account_id} n'existe pas.")
        if account.main:
             raise ValueError("Vous ne pouvez pas cloturer votre compte principal.")

        # Mettre à jour le statut du compte à False
        account.status = False
        session.add(account)  # Ajout nécessaire pour enregistrer les modifications
        session.commit()
        session.refresh(account)  # Actualiser le compte depuis la base de données

        return account

    



account_service_instance = AccountService()