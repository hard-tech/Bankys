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

        if type in [TransactionType.TRANSFER, TransactionType.WITHDRAWAL]:
            account_from = session.query(Account).filter_by(id=addMoney.account_id_from).first()
            if not account_from:
                raise ValueError(f"Le compte source, avec l'ID {addMoney.account_id_from} n'existe pas.")
            if account_from.sold < addMoney.amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Fonds insuffisants sur le compte source."
                )

        if type in [TransactionType.TRANSFER, TransactionType.DEPOSIT]:
            account_to = session.query(Account).filter_by(id=addMoney.account_id_to).first()
            if not account_to:
                raise ValueError(f"Le compte destinataire, avec l'ID {addMoney.account_id_to} n'existe pas.")

        if type == TransactionType.DEPOSIT:
            account_to.sold += addMoney.amount
        elif type == TransactionType.WITHDRAWAL:
            account_from.sold -= addMoney.amount
        elif type == TransactionType.TRANSFER:
            account_from.sold -= addMoney.amount
            account_to.sold += addMoney.amount

        if account_from:
            session.add(account_from)
        if account_to:
            session.add(account_to)

        # Log the transaction for traceability
        transaction = Transaction(
            account_to_id=account_to.id if account_to else None,
            account_from_id=account_from.id if account_from else None,
            amount=addMoney.amount,
            type=type
        )

        session.add(transaction)
        session.commit()

        if account_to:
            session.refresh(account_to)

        return account_service_instance.get_infos_account(addMoney.account_id_to if account_to else addMoney.account_id_from, session)

transaction_service_instance = TransactionService()
