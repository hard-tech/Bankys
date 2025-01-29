from typing import List
from fastapi import status
from sqlmodel import Session
from app.models.account import Account
from app.models.transaction import Transaction, TransactionType, TransactionStatus
from app.schemas.account import Account_Add_Money, Account_Info
from app.services.account_service import account_service_instance
from app.utils.exceptions import CustomHTTPException

import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.session import SessionLocal

async def refresh_transactions():
    while True:
        # Créer une session pour chaque cycle
        with SessionLocal() as session:
            now = datetime.utcnow()

            # Récupérer les transactions PENDING
            pending_transactions = session.query(Transaction).filter(
                Transaction.status == TransactionStatus.PENDING,
                Transaction.created_at <= now - timedelta(seconds=5)
            ).all()

            # Mettre à jour les transactions
            for transaction in pending_transactions:
                transaction.status = TransactionStatus.COMPLETED
                session.add(transaction)

            # Sauvegarder les changements
            session.commit()

        # Attendre avant la prochaine exécution
        await asyncio.sleep(15)

class TransactionService:

    def transfert_money(self, user_id: int, addMoney: Account_Add_Money, type: TransactionType, session: Session) -> Account_Info:
        try:
            # Vérifier si le montant est positif
            if addMoney.amount <= 0:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Le montant doit être positif.",
                    error_code="NEGATIVE_AMOUNT"
                )

            account_from: Account = None
            account_to: Account = None

            # Vérifier le type de transaction et récupérer le compte source si nécessaire
            if type in [TransactionType.TRANSFER, TransactionType.WITHDRAWAL]:
                account_from = session.query(Account).filter_by(iban=addMoney.account_iban_from).first()
                if not account_from:
                    raise CustomHTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Le compte source, avec l'ID {addMoney.account_iban_from} n'existe pas.",
                        error_code="SOURCE_ACCOUNT_NOT_FOUND"
                    )
                if not account_from.actived:
                    raise CustomHTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Le compte source n'est pas actif.",
                        error_code="SOURCE_ACCOUNT_INACTIVE"
                    )
                if account_from.balance < addMoney.amount:
                    raise CustomHTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Fonds insuffisants sur le compte source.",
                        error_code="INSUFFICIENT_FUNDS"
                    )
                if account_from.user_id != user_id:
                    raise CustomHTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Le compte source n'appartient pas à l'utilisateur.",
                        error_code="SOURCE_ACCOUNT_UNAUTHORIZED"
                    )

            # Récupérer le compte destinataire si nécessaire
            if type in [TransactionType.TRANSFER, TransactionType.DEPOSIT]:
                account_to = session.query(Account).filter_by(iban=addMoney.account_iban_to).first()
                if not account_to:
                    raise CustomHTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Le compte destinataire, avec l'ID {addMoney.account_iban_to} n'existe pas.",
                        error_code="DESTINATION_ACCOUNT_NOT_FOUND"
                    )
                if not account_to.actived:
                    raise CustomHTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Le compte destinataire n'est pas actif.",
                        error_code="DESTINATION_ACCOUNT_INACTIVE"
                    )
                if account_from and account_from.iban == account_to.iban:
                    raise CustomHTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Le compte destinataire doit être différent du compte source.",
                        error_code="SAME_ACCOUNT_TRANSFER"
                    )

            # Vérifier si le compte appartient à l'utilisateur connecté
            if type == TransactionType.DEPOSIT:
                if account_to.user_id != user_id:
                    raise CustomHTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Le compte source n'appartient pas à l'utilisateur.",
                        error_code="SOURCE_ACCOUNT_UNAUTHORIZED"
                    )

            # Effectuer la transaction en fonction du type
            if type == TransactionType.DEPOSIT:
                account_to.balance += addMoney.amount
            elif type == TransactionType.WITHDRAWAL:
                account_from.balance -= addMoney.amount
            elif type == TransactionType.TRANSFER:
                account_from.balance -= addMoney.amount
                account_to.balance += addMoney.amount

            # Ajouter les comptes modifiés à la session
            if account_from:
                session.add(account_from)
            if account_to:
                session.add(account_to)

            # Enregistrer la transaction pour la traçabilité
            transaction = Transaction(
                account_to_iban=account_to.iban if account_to else None,
                account_from_iban=account_from.iban if account_from else None,
                user_id=user_id,
                amount=addMoney.amount,
                type=type
            )

            session.add(transaction)
            session.commit()

            # Actualiser le compte destinataire si nécessaire
            if account_to:
                session.refresh(account_to)

            # Retourner les informations du compte mis à jour
            return account_service_instance.get_infos_account(addMoney.account_iban_to if account_to else addMoney.account_iban_from, session)

        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors du transfert d'argent.",
                error_code="TRANSFER_ERROR"
            )

    def get_transaction(self, transaction_id: int, session: Session, user_id: int) -> Transaction:
        try:
            # Récupérer la transaction par ID
            transaction = session.query(Transaction).filter_by(id=transaction_id).first()

            if not transaction:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Transaction non trouvée",
                    error_code="TRANSACTION_NOT_FOUND"
                )

            # Vérifier si l'utilisateur est soit l'expéditeur soit le destinataire
            account_from = session.query(Account).filter_by(iban=transaction.account_from_iban).first()
            account_to = session.query(Account).filter_by(iban=transaction.account_to_iban).first()

            if (account_from and account_from.user_id == user_id) or (account_to and account_to.user_id == user_id):
                return transaction

            raise CustomHTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à voir cette transaction",
                error_code="UNAUTHORIZED_ACCESS"
            )

        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la récupération de la transaction.",
                error_code="GET_TRANSACTION_ERROR"
            )
    def get_transactions_by_user(self, user_id: int, session: Session) -> List[Transaction]:
        try:
            # Récupérer les IBANs des comptes de l'utilisateur
            user_accounts = session.query(Account.iban).filter_by(user_id=user_id).subquery()

            # Récupérer uniquement les transactions de type TRANSFER associées aux comptes de l'utilisateur
            transactions = session.query(Transaction).filter(
                ((Transaction.account_from_iban.in_(user_accounts)) |
                 (Transaction.account_to_iban.in_(user_accounts))) 
                #  & (Transaction.type == TransactionType.TRANSFER) # TODO: À supprimer si vous souhaitez récupérer toutes les transactions (les transactions de dépôt, et de retrait) car ont ne savait pas le besoin exacte
            ).order_by(Transaction.created_at.desc()).all()

            return transactions

        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la récupération des transactions de l'utilisateur.",
                error_code="GET_USER_TRANSACTIONS_ERROR"
            )
    def cancel_transaction(self, user_id: int, transaction_id: int, session: Session) -> str:
        try:
            # Récupérer la transaction
            transaction = session.query(Transaction).filter_by(id=transaction_id).first()

            # Vérifier si la transaction existe
            if not transaction:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Transaction non trouvée.",
                    error_code="TRANSACTION_NOT_FOUND"
                )
            # Vérifier si c'est bien un type transfert
            if transaction.type!= TransactionType.TRANSFER:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La transaction ne peut pas être annulée car c'est un dépôt ou un retrait.",
                    error_code="INVALID_TRANSACTION_TYPE"
                )

            # Récupérer les comptes de l'utilisateur
            account_from = session.query(Account).filter_by(iban=transaction.account_from_iban).first()
            account_to = session.query(Account).filter_by(iban=transaction.account_to_iban).first()

            # Annuler le mouvement d'argent en fonction du type de transaction

            # Vérifier si c'est bien l'utilisateur qui a créé la transaction
            if transaction.user_id != user_id:
                raise CustomHTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Vous n'êtes pas autorisé à annuler cette transaction.",
                    error_code="UNAUTHORIZED_ACCESS"
                )

            # Vérifier si la transaction est encore en état PENDING
            if transaction.status != TransactionStatus.PENDING:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La transaction ne peut pas être annulée car elle n'est pas en état PENDING.",
                    error_code="TRANSACTION_NOT_PENDING"
                )

            # Vérifier si la transaction a été créée il y a moins de 5 secondes
            if datetime.utcnow() > transaction.created_at + timedelta(seconds=5):
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La transaction ne peut plus être annulée après 5 secondes.",
                    error_code="CANCEL_TIMEOUT"
                )

            # Vérifier si les comptes existents
            if not account_from or not account_to:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Comptes source ou destinataire non trouvés.",
                    error_code="ACCOUNTS_NOT_FOUND"
                )

            # Restaurer les balance
            account_from.balance += transaction.amount
            account_to.balance -= transaction.amount

            session.add(account_from)
            session.add(account_to)

            # Mettre à jour le statut de la transaction
            transaction.status = TransactionStatus.REJECTED
            session.add(transaction)
            session.commit()

            return Transaction(
                id=transaction.id,
                account_from_iban=transaction.account_from_iban,
                account_to_iban=transaction.account_to_iban,
                user_id=transaction.user_id,
                amount=transaction.amount,
                type=transaction.type,
                status=TransactionStatus.REJECTED,
                created_at=transaction.created_at,
                updated_at=datetime.utcnow()
            )

        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de l'annulation de la transaction.",
                error_code="CANCEL_TRANSACTION_ERROR"
            )

transaction_service_instance = TransactionService()