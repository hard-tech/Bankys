# Étape de build
FROM node:20 as build

# Définir le répertoire de travail
WORKDIR /app

# Copier le package.json du frontend
COPY frontend/package*.json ./

# Installer les dépendances
RUN yarn install

# Copier les fichiers source du frontend
COPY frontend/ .

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