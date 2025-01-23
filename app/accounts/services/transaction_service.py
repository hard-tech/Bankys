from fastapi import HTTPException, status
from sqlmodel import Session
from app.accounts.models.account import Account
from app.accounts.models.transaction import Transaction, TransactionType
from app.accounts.schemas.account import Account_Add_Money, Account_Info
from app.accounts.services.account_service import account_service_instance

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

transaction_service_instance = TransactionService()
