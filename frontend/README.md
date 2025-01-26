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
frontend/
├── src/
│   ├── assets/          # Ressources statiques
│   ├── components/      # Composants réutilisables
│   ├── hooks/          # Hooks personnalisés
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   └── useWindowSize.ts
│   ├── layouts/        # Composants de mise en page
│   │   ├── Layout.tsx
│   │   ├── NavBar.tsx
│   │   └── SideBar.tsx
│   ├── pages/          # Pages de l'application
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/       # Services et API
│   │   ├── api/
│   │   └── auth/
│   └── utils/          # Utilitaires
```

## Technologies Utilisées

- **React** avec **TypeScript**
- **Vite** pour le bundling et le développement
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Axios** pour les requêtes API

## Installation

```bash
# Cloner le projet
git clone [url-du-projet]

# Installer les dépendances
cd frontend
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

## Configuration

### Environnement
Créez un fichier `.env` à la racine du projet :
```env
VITE_API_URL=http://localhost:8000
```

### TypeScript
Le projet utilise deux configurations TypeScript :
- `tsconfig.app.json` : Configuration pour l'application React
- `tsconfig.node.json` : Configuration pour l'environnement Node.js

## Architecture

### Composants
- **Layout** : Structure principale de l'application
- **NavBar** : Barre de navigation responsive
- **SideBar** : Menu latéral avec navigation

### Pages
- **Home** : Page d'accueil
- **Login** : Authentification
- **Register** : Création de compte

### Services
- **API** : Configuration Axios et endpoints
- **Auth** : Gestion de l'authentification

### Utilitaires
- **Formatters** : Formatage des dates et montants
- **Validators** : Validation des formulaires
- **Constants** : Variables globales
- **Helpers** : Fonctions utilitaires

## Déploiement

1. Construire l'application :
```bash
yarn build
```

2. Le dossier `dist` contient l'application optimisée pour la production

3. Options de déploiement :
- Vercel (recommandé)
- Netlify
- Hébergement statique classique

## Développement

### Structure des Composants
```typescript
import React from 'react';

const Component = () => {
  return (
    <div>
      // Contenu
    </div>
  );
};

export default Component;
```

### Gestion des États
Utilisation des hooks personnalisés pour la gestion des états globaux :
```typescript
const { isAuthenticated, user } = useAuth();
```

## Contribution

1. Créer une branche pour la fonctionnalité
2. Commiter les changements
3. Créer une Pull Request

## Licence

MIT