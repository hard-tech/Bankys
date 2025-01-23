from typing import List
from fastapi import HTTPException, status
from sqlmodel import Session
from app.accounts.models.account import Account
from app.accounts.models.transaction import Transaction, TransactionType, TransactionStatus
from app.accounts.schemas.account import Account_Add_Money, Account_Info
from app.accounts.services.account_service import account_service_instance

import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.session import SessionLocal



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
        await asyncio.sleep(10)

class TransactionService:


    

    def transfert_money(self, addMoney: Account_Add_Money, type: TransactionType, session: Session) -> Account_Info:
        if addMoney.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le montant doit être positif."
            )

        account_from: Account = None
        account_to: Account = None

        # Vérifier le type de transaction et récupérer le compte source si nécessaire
        if type in [TransactionType.TRANSFER, TransactionType.WITHDRAWAL]:
            account_from = session.query(Account).filter_by(iban=addMoney.account_iban_from).first()
            if not account_from:
                raise ValueError(f"Le compte source, avec l'ID {addMoney.account_iban_from} n'existe pas.")
            if account_from.sold < addMoney.amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Fonds insuffisants sur le compte source."
                )

        # Récupérer le compte destinataire si nécessaire
        if type in [TransactionType.TRANSFER, TransactionType.DEPOSIT]:
            account_to = session.query(Account).filter_by(iban=addMoney.account_iban_to).first()
            if not account_to:
                raise ValueError(f"Le compte destinataire, avec l'ID {addMoney.account_iban_to} n'existe pas.")

        # Effectuer la transaction en fonction du type
        if type == TransactionType.DEPOSIT:
            account_to.sold += addMoney.amount
        elif type == TransactionType.WITHDRAWAL:
            account_from.sold -= addMoney.amount
        elif type == TransactionType.TRANSFER:
            account_from.sold -= addMoney.amount
            account_to.sold += addMoney.amount

        # Ajouter les comptes modifiés à la session
        if account_from:
            session.add(account_from)
        if account_to:
            session.add(account_to)

        # Enregistrer la transaction pour la traçabilité
        transaction = Transaction(
            account_to_iban=account_to.iban if account_to else None,
            account_from_iban=account_from.iban if account_from else None,
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

    def get_transaction(self, transaction_id: int, session: Session) -> Transaction:
        return session.query(Transaction).filter_by(id=transaction_id).first()
    
    def get_transactions_by_user(self, user_id: int, session: Session) -> List[Transaction]:
        user_accounts = session.query(Account.iban).filter_by(user_id=user_id).subquery()

        transactions = session.query(Transaction).filter(
            (Transaction.account_from_iban.in_(user_accounts)) |
            (Transaction.account_to_iban.in_(user_accounts))
        ).order_by(Transaction.created_at.desc()).all()

        return transactions
    

    
   

transaction_service_instance = TransactionService()
