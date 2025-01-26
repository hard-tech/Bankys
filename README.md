# Bankys - Banque en ligne 整 - Guide de Déploiement

## Prérequis

- Docker et Docker Compose installés
- Node.js et Yarn pour le développement local
- Git pour la gestion du code source

## Structure du Projet

```
Bankys/
├── frontend/          # Application React/TypeScript
├── backend/           # API FastAPI
└── docker-compose.yml # Configuration Docker
```

## Configuration Docker

### Frontend

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ .
RUN yarn build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Backend

```dockerfile
# Backend Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./app.db
```

## Déploiement

1. **Construction des images**

```bash
docker-compose build
```

2. **Lancement des services**

```bash
docker-compose up -d
```

3. **Vérification des services**

```bash
docker-compose ps
```

## Variables d'Environnement

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

### Backend (.env)

```env
DATABASE_URL=sqlite:///./app.db
JWT_SECRET=votre_secret_jwt
```

## Commandes Utiles

```bash
# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart [service]
```

## Sauvegarde et Restauration

```bash
# Sauvegarde de la base de données
docker-compose exec backend python backup.py

# Restauration
docker-compose exec backend python restore.py
```

## Surveillance

- Les logs sont accessibles via `docker-compose logs`
- Le statut des conteneurs via `docker-compose ps`
- L'API est accessible sur `http://localhost:8000`
- L'interface web sur `http://localhost:80`

## Résolution des Problèmes

1. Vérifier les logs des conteneurs
2. Redémarrer les services si nécessaire
3. Vérifier les variables d'environnement
4. S'assurer que les ports ne sont pas utilisés

## Sécurité

- Utilisez des secrets pour les variables sensibles
- Configurez NGINX correctement
- Mettez à jour régulièrement les images
- Surveillez les vulnérabilités

Citations:
[1] <https://pplx-res.cloudinary.com/image/upload/v1737918427/user_uploads/tfBCeGhpDrntNXL/image.jpg>
