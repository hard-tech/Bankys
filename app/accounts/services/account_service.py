from fastapi import HTTPException, status
from sqlmodel import Session
from app.accounts.schemas.account import *
from app.accounts.models.account import Account
import random
import string
from sqlmodel import Session
from app.accounts.models.account import Account

def generate_iban(session: Session) -> str:
    while True:
        # Generate a random IBAN-like string with a fixed prefix and random alphanumeric characters
        prefix = "FR"
        random_part = ''.join(random.choices(string.digits, k=20))
        iban = f"{prefix}{random_part}"

        # Check if the IBAN already exists in the database
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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Le compte avec l'ID {account_id} n'existe pas."
            )
        if account.main:
             raise ValueError("Vous ne pouvez pas cloturer votre compte principal.")

        # Mettre à jour le statut du compte à False
        account.status = False
        session.add(account)  # Ajout nécessaire pour enregistrer les modifications
        session.commit()
        session.refresh(account)  # Actualiser le compte depuis la base de données

        return account

    def get_accounts_of_user(self, user_id: int, session: Session) -> Get_Accounts:
        accounts = session.query(Account).filter_by(user_id=user_id).order_by(Account.id.desc()).all()

        if accounts:
            return [
            Get_Accounts(
                id=account.id,
                sold=account.sold,
                iban=account.iban,
            )
            for account in accounts
        ]
        else:
            return None

    def get_infos_account(self, account_id: int, session: Session) -> Account_Info:

        account = session.query(Account).filter_by(id=account_id).first()

        if account:

            return Account_Info(
                id=account.id,
                sold=account.sold,
                iban=account.iban,
                user_id=account.user_id,
                status=account.status,
                main=account.main
            )
        return None
        



account_service_instance = AccountService()