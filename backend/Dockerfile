FROM python:3

# Définir le répertoire de travail pour le backend
WORKDIR /app

# Mettre à jour pip avant de créer l'environnement virtuel
RUN pip install --upgrade pip

# Copier le fichier requirements.txt du backend
COPY ./backend/requirements.txt .

# Installer les dépendances dans l'environnement virtuel
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste des fichiers de l'application backend
COPY ./backend /app

# Exposer le port 8000
EXPOSE 8000

# Lancer l'application avec gunicorn et uvicorn worker
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--host", "0.0.0.0", "--port", "8000"]
