from fastapi import status
from sqlmodel import Session
from app.accounts.schemas.account import *
from app.accounts.models.account import Account
from app.core.exceptions import CustomHTTPException
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
        try:
            # Créer un compte principal avec un solde initial de 100
            account = Account(sold=100, iban=generate_iban(session), user_id=user_id, status=True, main=True)
            session.add(account)
            session.commit()
            session.refresh(account)
            return account
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la création du compte principal",
                error_code="CREATE_PRINCIPAL_ACCOUNT_ERROR"
            )

    def create_account(self, user_id: int, session: Session) -> Account:
        try:
            # Créer un compte secondaire avec un solde initial de 0
            account = Account(sold=0, iban=generate_iban(session), user_id=user_id, actived=True, main=False)
            session.add(account)
            session.commit()
            session.refresh(account)
            return account
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la création du compte",
                error_code="CREATE_ACCOUNT_ERROR"
            )

    def close_account(self, account_id: int, session: Session) -> Account:
        try:
            # Récupérer le compte en fonction de l'ID
            account = session.query(Account).filter_by(id=account_id).first()

            # Vérifier si le compte existe
            if not account:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Le compte avec l'ID {account_id} n'existe pas.",
                    error_code="ACCOUNT_NOT_FOUND"
                )
            if account.main:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous ne pouvez pas clôturer votre compte principal.",
                    error_code="CLOSE_MAIN_ACCOUNT_ERROR"
                )

            # Mettre à jour le statut du compte à False
            account.actived = False

            session.add(account)  # Ajout nécessaire pour enregistrer les modifications
            session.commit()
            session.refresh(account)  # Actualiser le compte depuis la base de données

            return account
        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la fermeture du compte",
                error_code="CLOSE_ACCOUNT_ERROR"
            )

    def get_accounts_of_user(self, user_id: int, session: Session) -> Get_Accounts:
        try:
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
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Aucun compte trouvé pour cet utilisateur",
                    error_code="NO_ACCOUNTS_FOUND"
                )
        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la récupération des comptes",
                error_code="GET_ACCOUNTS_ERROR"
            )

    def get_infos_account(self, account_iban: str, session: Session) -> Account_Info:
        try:
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
            raise CustomHTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compte non trouvé",
                error_code="ACCOUNT_NOT_FOUND"
            )
        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la récupération des informations du compte",
                error_code="GET_ACCOUNT_INFO_ERROR"
            )

    def get_info_account_id(self, account_id: int, session: Session) -> Account_Info:
        try:
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
            raise CustomHTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compte non trouvé",
                error_code="ACCOUNT_NOT_FOUND"
            )
        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la récupération des informations du compte",
                error_code="GET_ACCOUNT_INFO_ERROR"
            )

account_service_instance = AccountService()