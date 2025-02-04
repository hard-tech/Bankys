# Étape de build
FROM node:22.13-alpine3.20 as build

# Définir le répertoire de travail
WORKDIR /app

# Copier le package.json du frontend
COPY frontend/package*.json ./

# Installer les dépendances
RUN yarn install

# Copier les fichiers source et le fichier .env.production
COPY frontend/ .
RUN touch .env.production

# Ajouter ces lignes pour gérer VITE_API_URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# Construire l'application
RUN yarn build

# Étape de production
FROM nginx:alpine

# Copier les fichiers de build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]