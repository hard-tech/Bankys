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
        await asyncio.sleep(15)

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
      
    def get_transaction(self, transaction_id: int, session: Session, user_id: int) -> Transaction:
        transaction = session.query(Transaction).filter_by(id=transaction_id).first()

        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )

        # Check if the user is either the sender or the recipient
        account_from = session.query(Account).filter_by(iban=transaction.account_from_iban).first()
        account_to = session.query(Account).filter_by(iban=transaction.account_to_iban).first()

        if (account_from and account_from.user_id == user_id) or (account_to and account_to.user_id == user_id):
            return transaction

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this transaction"
        )
    
    def get_transactions_by_user(self, user_id: int, session: Session) -> List[Transaction]:
        user_accounts = session.query(Account.iban).filter_by(user_id=user_id).subquery()

        transactions = session.query(Transaction).filter(
            (Transaction.account_from_iban.in_(user_accounts)) |
            (Transaction.account_to_iban.in_(user_accounts))
        ).order_by(Transaction.created_at.desc()).all()

        return transactions
    


    def cancel_transaction(self, transaction_id: int, session: Session) -> str:
        """
        Annule une transaction si elle est en état PENDING et dans la limite des 5 secondes.
        Annule le mouvement d'argent sur les comptes si la transaction est un dépôt, un retrait ou un transfert.
        """
        # Récupérer la transaction
        transaction = session.query(Transaction).filter_by(id=transaction_id).first()
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction non trouvée.")
        
        # Vérifier si la transaction est encore en état PENDING
        if transaction.status != TransactionStatus.PENDING:
            raise HTTPException(
                status_code=400,
                detail="La transaction ne peut pas être annulée car elle n'est pas en état PENDING."
            )
        
        # Vérifier si la transaction a été créée il y a moins de 5 secondes
        if datetime.utcnow() > transaction.created_at + timedelta(seconds=5):
            raise HTTPException(
                status_code=400,
                detail="La transaction ne peut plus être annulée après 5 secondes."
            )

        # Gérer le mouvement d'argent en fonction du type de transaction
        if transaction.type == TransactionType.TRANSFER:
            # Transfert entre deux comptes
            account_from = session.query(Account).filter_by(iban=transaction.account_from_iban).first()
            account_to = session.query(Account).filter_by(iban=transaction.account_to_iban).first()

            if not account_from or not account_to:
                raise HTTPException(status_code=404, detail="Comptes source ou destinataire non trouvés.")
            
            # Restaurer les soldes
            account_from.sold += transaction.amount  # Restaurer le solde du compte source
            account_to.sold -= transaction.amount    # Retirer l'argent du compte destinataire

            session.add(account_from)
            session.add(account_to)

        elif transaction.type == TransactionType.DEPOSIT:
            # Dépôt sur un compte
            account_to = session.query(Account).filter_by(iban=transaction.account_to_iban).first()

            if not account_to:
                raise HTTPException(status_code=404, detail="Compte destinataire non trouvé.")
            
            # Retirer l'argent du compte de dépôt
            account_to.sold -= transaction.amount
            session.add(account_to)

        elif transaction.type == TransactionType.WITHDRAWAL:
            # Retrait du compte
            account_from = session.query(Account).filter_by(iban=transaction.account_from_iban).first()

            if not account_from:
                raise HTTPException(status_code=404, detail="Compte source non trouvé.")
            
            # Restaurer l'argent dans le compte source
            account_from.sold += transaction.amount
            session.add(account_from)

        # Mettre à jour le statut de la transaction
        transaction.status = TransactionStatus.REJECTED
        session.add(transaction)
        session.commit()
        
        return "Transaction annulée avec succès, les soldes ont été restaurés."
    

    


transaction_service_instance = TransactionService()
