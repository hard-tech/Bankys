# Bankys - Banque en ligne 整 - Application Frontend React/TypeScript

## Description

Interface utilisateur moderne pour une application bancaire, développée avec React et TypeScript. Cette application permet aux utilisateurs de gérer leurs comptes, effectuer des transactions et suivre leurs finances de manière intuitive.

## Stack Technique

- React 18 avec TypeScript
- Vite pour le bundling
- Tailwind CSS pour le styling
- React Router pour la navigation
- Axios pour les requêtes API
- React Icons pour l'interface

## Structure du Projet

```
src/
├── assets/          # Ressources statiques
├── components/      # Composants réutilisables
├── hooks/          # Hooks personnalisés
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── useWindowSize.ts
├── layouts/        # Composants de mise en page
│   ├── Layout.tsx
│   ├── NavBar.tsx
│   └── SideBar.tsx
├── pages/          # Pages principales
├── services/       # Services API
├── types/         # Types TypeScript
└── utils/         # Utilitaires
```

## Installation

```bash
# Cloner le projet
git clone [url-du-projet]

# Installer les dépendances
yarn install
```

## Scripts Disponibles

```bash
# Développement
yarn dev

# Production
yarn build

# Prévisualisation
yarn preview
```

## Fonctionnalités Principales

**Interface Utilisateur**

- Design responsive
- Navigation fluide
- Thème personnalisable

**Authentification**

- Connexion sécurisée
- Gestion des sessions
- Protection des routes

**Gestion des Comptes**

- Vue d'ensemble des comptes
- Détails des transactions
- Virements entre comptes

## Configuration

### Environnement

```env
VITE_API_URL=http://localhost:8000
```

### TypeScript

- `tsconfig.app.json` : Configuration React
- `tsconfig.node.json` : Configuration Node.js

## Développement

### Conventions de Code

- Utilisation de composants fonctionnels
- Hooks personnalisés pour la logique réutilisable
- TypeScript strict mode

### État Global

- Gestion des états avec Context API
- Services centralisés pour les appels API

## Déploiement

1. Build de production :

```bash
yarn build
```

2. Options de déploiement :

- Vercel (recommandé)
- Netlify
- Serveur statique

## Contribution

1. Créer une branche feature
2. Commiter les changements
3. Soumettre une Pull Request

## License

MIT
