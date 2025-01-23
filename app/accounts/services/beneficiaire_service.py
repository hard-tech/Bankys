from fastapi import status
from sqlmodel import Session
from app.accounts.schemas.beneficiaire import Get_Beneficiaires
from app.accounts.models.beneficiaire import Beneficiaire
from app.accounts.models.account import Account
from app.auth.models.user import User
from app.core.exceptions import CustomHTTPException

class BeneficiaireService:
    def create_beneficiaire(
        self, 
        user_id_envoyeur: int, 
        beneficiary_name: str, 
        account_id_to: int, 
        session: Session
    ) -> Beneficiaire:
        try:
            # Vérifie si l'utilisateur envoyeur existe
            envoyeur = session.query(User).filter_by(id=user_id_envoyeur).first()
            if not envoyeur:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"L'utilisateur envoyeur avec ID {user_id_envoyeur} n'existe pas.",
                    error_code="USER_NOT_FOUND"
                )

            # Vérifie si le compte receveur existe
            account_receveur = session.query(Account).filter_by(id=account_id_to).first()
            if not account_receveur:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Le compte receveur avec ID {account_id_to} n'existe pas.",
                    error_code="ACCOUNT_NOT_FOUND"
                )

            # Vérifie si l'utilisateur receveur existe
            receveur = session.query(User).filter_by(id=account_receveur.user_id).first()
            if not receveur:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"L'utilisateur receveur avec ID {account_receveur.user_id} n'existe pas.",
                    error_code="USER_NOT_FOUND"
                )

            # Vérifie que l'IBAN du receveur n'est pas associé à l'utilisateur envoyeur
            iban_receveur = account_receveur.iban
            envoyeur_accounts = session.query(Account).filter_by(user_id=user_id_envoyeur).all()
            if any(account.iban == iban_receveur for account in envoyeur_accounts):
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="L'IBAN du receveur ne peut pas être un IBAN associé à l'utilisateur envoyeur.",
                    error_code="IBAN_ASSOCIATED_WITH_SENDER"
                )

            # Vérifie que le compte receveur est actif
            if not account_receveur.actived:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Le compte receveur n'est pas actif.",
                    error_code="ACCOUNT_NOT_ACTIVE"
                )

            # Vérifie que le bénéficiaire avec le même IBAN n'existe pas déjà pour cet envoyeur
            existing_beneficiaire = session.query(Beneficiaire).filter_by(
                beneficiary_sender=user_id_envoyeur,
                iban_receveur=iban_receveur
            ).first()
            if existing_beneficiaire:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Un bénéficiaire avec le même IBAN existe déjà pour cet utilisateur envoyeur.",
                    error_code="BENEFICIARY_ALREADY_EXISTS"
                )

            # Crée le bénéficiaire
            beneficiaire = Beneficiaire(
                beneficiary_receiver=account_receveur.user_id,
                beneficiary_sender=user_id_envoyeur,
                beneficiary_name=beneficiary_name,
                name_beneficiary_receiver=receveur.first_name,
                iban_receveur=iban_receveur
            )
            session.add(beneficiaire)
            session.commit()
            session.refresh(beneficiaire)
            return beneficiaire
        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la création du bénéficiaire",
                error_code="CREATE_BENEFICIARY_ERROR"
            )

    def get_benificiaires_of_user(self, user_id: int, session: Session) -> Get_Beneficiaires:
        try:
            # Récupère tous les bénéficiaires de l'utilisateur
            beneficiaires = session.query(Beneficiaire).filter_by(beneficiary_sender=user_id).order_by(Beneficiaire.created_at.desc()).all()

            if beneficiaires:
                return [
                    Get_Beneficiaires(
                        id=beneficiaire.id,
                        name=beneficiaire.name_beneficiary_receiver,
                        iban=beneficiaire.iban_receveur,
                        date=beneficiaire.created_at
                    )
                    for beneficiaire in beneficiaires
                ]
            else:
                raise CustomHTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Aucun bénéficiaire trouvé pour cet utilisateur",
                    error_code="NO_BENEFICIARIES_FOUND"
                )
        except CustomHTTPException as e:
            raise e
        except Exception as e:
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la récupération des bénéficiaires",
                error_code="GET_BENEFICIARIES_ERROR"
            )

beneficiaire_service_instance = BeneficiaireService()