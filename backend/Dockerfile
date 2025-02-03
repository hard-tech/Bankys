FROM python:3

WORKDIR /app

# Mettre à jour pip avant de créer l'environnement virtuel
RUN pip install --upgrade pip

# Créer et activer l'environnement virtuel
RUN python -m venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copier le fichier requirements.txt
COPY requirements.txt .

# Installer les dépendances dans l'environnement virtuel
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste de l'application
COPY . .

# Lancer l'application avec uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]