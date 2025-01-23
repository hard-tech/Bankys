from fastapi import HTTPException, status
from sqlmodel import Session
from app.accounts.schemas.account import *
from app.accounts.models.account import Account
import random
import string

def generate_iban(session: Session) -> str:
    while True:
        # Générer une chaîne aléatoire de type IBAN avec un préfixe fixe et des caractères alphanumériques aléatoires
        prefix = "FR"
        random_part = ''.join(random.choices(string.digits, k=20))
        iban = f"{prefix}{random_part}"

        # Vérifier si l'IBAN existe déjà dans la base de données
        if not session.query(Account).filter_by(iban=iban).first():
            return iban

class AccountService:

    def create_principal_account(self, user_id: int, session: Session) -> Account:
        # Créer un compte principal avec un solde initial de 100
        account = Account(sold=100, iban=generate_iban(session), user_id=user_id, status=True, main=True)
        session.add(account)
        session.commit()
        session.refresh(account)
        return account

    def create_account(self, user_id: int, session: Session) -> Account:
        # Créer un compte secondaire avec un solde initial de 0
        account = Account(sold=0, iban=generate_iban(session), user_id=user_id, actived=True, main=False)
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
            raise ValueError("Vous ne pouvez pas clôturer votre compte principal.")

        # Mettre à jour le statut du compte à False
        account.actived = False

        session.add(account)  # Ajout nécessaire pour enregistrer les modifications
        session.commit()
        session.refresh(account)  # Actualiser le compte depuis la base de données

        return account

    def get_accounts_of_user(self, user_id: int, session: Session) -> Get_Accounts:
        # Récupérer tous les comptes de l'utilisateur
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

    def get_infos_account(self, account_iban: str, session: Session) -> Account_Info:
        # Récupérer les informations du compte en fonction de l'IBAN
        account = session.query(Account).filter_by(iban=account_iban).first()

        if account:
            return Account_Info(
                id=account.id,
                sold=account.sold,
                iban=account.iban,
                user_id=account.user_id,
                actived=account.actived,
                main=account.main
            )
        return None

    def get_info_account_id(self, account_id: int, session: Session) -> Account_Info:
        # Récupérer les informations du compte en fonction de l'ID
        account = session.query(Account).filter_by(id=account_id).first()

        if account:
            return Account_Info(
                id=account.id,
                sold=account.sold,
                iban=account.iban,
                user_id=account.user_id,
                actived=account.actived,
                main=account.main
            )
        return None

account_service_instance = AccountService()