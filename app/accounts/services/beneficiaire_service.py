from fastapi import HTTPException, status
from sqlmodel import Session
from app.accounts.schemas.beneficiaire import Get_Beneficiaires
from app.accounts.models.beneficiaire import Beneficiaire
from app.accounts.models.account import Account
from app.auth.models.user import User


class BeneficiaireService:
    def create_beneficiaire(
        self, 
        user_id_envoyeur: int, 
        account_id_receveur: int, 
        session: Session
    ) -> Beneficiaire:
        
        # Vérifie si l'utilisateur envoyeur existe
        envoyeur = session.query(User).filter_by(id=user_id_envoyeur).first()
        if not envoyeur:
            raise ValueError(f"L'utilisateur envoyeur avec ID {user_id_envoyeur} n'existe pas.")
        
        # Vérifie si le compte receveur existe
        account_receveur = session.query(Account).filter_by(id=account_id_receveur).first()
        if not account_receveur:
            raise ValueError(f"Le compte receveur avec ID {account_id_receveur} n'existe pas.")
        
        # Vérifie si l'utilisateur receveur existe
        receveur = session.query(User).filter_by(id=account_receveur.user_id).first()
        if not receveur:
            raise ValueError(f"L'utilisateur receveur avec ID {account_receveur.user_id} n'existe pas.")

        # Vérifie que l'IBAN du receveur n'est pas associé à l'utilisateur envoyeur
        iban_receveur = account_receveur.iban
        envoyeur_accounts = session.query(Account).filter_by(user_id=user_id_envoyeur).all()
        if any(account.iban == iban_receveur for account in envoyeur_accounts):
            raise ValueError("L'IBAN du receveur ne peut pas être un IBAN associé à l'utilisateur envoyeur.")
        
        # Vérifie que le bénéficiaire avec le même IBAN n'existe pas déjà pour cet envoyeur
        existing_beneficiaire = session.query(Beneficiaire).filter_by(
            beneficiaire_envoyeur=user_id_envoyeur,
            iban_receveur=iban_receveur
        ).first()
        if existing_beneficiaire:
            raise ValueError("Un bénéficiaire avec le même IBAN existe déjà pour cet utilisateur envoyeur.")

        # Crée le bénéficiaire
        beneficiaire = Beneficiaire(
            beneficiaire_receveur=account_receveur.user_id,
            beneficiaire_envoyeur=user_id_envoyeur,
            name_beneficiaire_receveur=receveur.first_name,
            iban_receveur=iban_receveur
        )
        session.add(beneficiaire)
        session.commit()
        session.refresh(beneficiaire)
        return beneficiaire
    

    def get_benificiaires_of_user(self, user_id: int, session: Session) -> Get_Beneficiaires:
        beneficiaires = session.query(Beneficiaire).filter_by(beneficiaire_envoyeur=user_id).order_by(Beneficiaire.created_at.desc()).all()

        if beneficiaires:
            return [
            Get_Beneficiaires(
                id=beneficiaire.id,
                name=beneficiaire.name_beneficiaire_receveur,
                iban=beneficiaire.iban_receveur,
                date=beneficiaire.created_at
            )
            for beneficiaire in beneficiaires
        ]
        else:
            return None

beneficiaire_service_instance = BeneficiaireService()