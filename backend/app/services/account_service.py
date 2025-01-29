from fastapi import status
from sqlmodel import Session
from app.models.transaction import Transaction, TransactionStatus
from app.schemas.account import *
from app.models.account import Account
from app.utils.exceptions import CustomHTTPException
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
            # Créer un compte principal avec un balance initial de 100
            account = Account(balance=100, iban=generate_iban(session), user_id=user_id, status=True, main=True, name="Principal")
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

    def create_account(self, user_id: int, account_name: str, session: Session) -> Account:
        try:
            # Créer un compte secondaire avec un balance initial de 0
            account = Account(balance=0, iban=generate_iban(session), user_id=user_id, actived=True, main=False, name=account_name)
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

    def close_account(self, account_id: int, user_id: int, session: Session) -> Account:
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

            # Vérifier si le compte est déjà clôturé
            if not account.actived:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ce compte est déjà clôturé.",
                    error_code="ACCOUNT_ALREADY_CLOSED"
                )
            
            # Vérifier si le compte appartient à l'utilisateur connecté
            if account.user_id != user_id:
                raise CustomHTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Vous n'êtes pas autorisé à clôturer ce compte.",
                    error_code="UNAUTHORIZED_ACCOUNT_CLOSURE"
                )
            
            # Vérifier si le compte est le principal
            if account.main:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vous ne pouvez pas clôturer votre compte principal.",
                    error_code="CLOSE_MAIN_ACCOUNT_ERROR"
                )

            # Vérifier s'il y a des transactions en cours pour ce compte
            pending_transactions = session.query(Transaction).filter(
                (Transaction.account_from_iban == account.iban) | 
                (Transaction.account_to_iban == account.iban),
                Transaction.status == TransactionStatus.PENDING
            ).first()

            if pending_transactions:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Le compte ne peut pas être clôturé car il y a des transactions en cours.",
                    error_code="PENDING_TRANSACTIONS_ERROR"
                )

            # Récupérer le compte principal de l'utilisateur
            main_account = session.query(Account).filter_by(user_id=account.user_id, main=True).first()

            if not main_account:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Compte principal non trouvé.",
                    error_code="MAIN_ACCOUNT_NOT_FOUND"
                )

            # Transférer le balance du compte à fermer vers le compte principal
            main_account.balance += account.balance
            account.balance = 0
            # Mettre à jour le statut du compte à False
            account.actived = False

            session.add(account)
            session.add(main_account)
            session.commit()
            session.refresh(account)

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
            # Récupérer tous les comptes actifs de l'utilisateur
            accounts = session.query(Account).filter_by(user_id=user_id, actived=True).order_by(Account.created_at.desc()).all()

            if accounts:
                return [
                    Get_Accounts(
                        id=account.id,
                        balance=account.balance,
                        name=account.name,
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
                # Vérifier si le compte est actif
                if not account.actived:
                    raise CustomHTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Ce compte est clôturé et ne peut pas être consulté.",
                        error_code="ACCOUNT_CLOSED"
                    )
                return Account_Info(
                    id=account.id,
                    balance=account.balance,
                    name=account.name,
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

    def get_info_account_id(self, user_id: int, account_id: int, session: Session) -> Account_Info:
        try:
            # Récupérer les informations du compte en fonction de l'ID
            account = session.query(Account).filter_by(id=account_id).first()

            if account:
                # Vérifier si le compte est actif
                if not account.actived:
                    raise CustomHTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Ce compte est clôturé et ne peut pas être consulté.",
                        error_code="ACCOUNT_CLOSED"
                    )
                
                # Vérifier si le compte appartient à l'utilisateur connecté
                if not account.user_id == user_id:
                    raise CustomHTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Vous n'êtes pas autorisé à consulter ce compte.",
                        error_code="UNAUTHORIZED_ACCOUNT_ACCESS"
                    )
                return Account_Info(
                    id=account.id,
                    balance=account.balance,
                    name=account.name,
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