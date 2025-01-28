# Bankys - Banque en ligne 整 - API Backend

## Description

API backend d'une application de banque en ligne développée avec FastAPI. Cette application permet aux utilisateurs de gérer leurs comptes bancaires, effectuer des transactions et gérer leurs bénéficiaires.

## Stack Technique

- FastAPI
- SQLite avec SQLModel (ORM)
- PyJWT pour l'authentification
- Pydantic pour la validation des données
- Passlib pour le hashage des mots de passe

## Installation

```bash
# Cloner le repository
git clone [votre-repo]

# Créer un environnement virtuel
python -m venv .venv

# Activer l'environnement virtuel
# Windows
.venv\Scripts\activate
# Unix
source .venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

## Démarrage

```bash
uvicorn app.main:app --reload
```

L'API sera accessible à l'adresse : `http://localhost:8000`
Documentation Swagger : `http://localhost:8000/docs`

## Fonctionnalités Principales

**Gestion des Utilisateurs**

- Inscription
- Connexion avec JWT
- Récupération des informations utilisateur

**Gestion des Comptes**

- Création automatique d'un compte principal (100€ offerts)
- Ouverture de comptes additionnels
- Consultation des soldes
- Clôture de compte

**Transactions**

- Dépôts
- Virements entre comptes
- Historique des transactions
- Annulation de transaction (délai de 5 secondes)

**Bénéficiaires**

- Ajout de bénéficiaires
- Consultation de la liste des bénéficiaires

## Structure du Projet

```
app/
├── accounts/            # Gestion des comptes
├── auth/               # Authentification
├── core/              # Composants fondamentaux
├── db/                # Configuration base de données
└── main.py           # Point d'entrée de l'application
```

## Développement

- Utilisez Git pour le versionnage
- Suivez les conventions de commit
- Testez vos fonctionnalités avant de commit
- Utilisez un board (Trello ou autre) pour suivre l'avancement

## Contribution

1. Créez une branche pour votre fonctionnalité
2. Committez vos changements
3. Créez une Pull Request

## License

MIT
