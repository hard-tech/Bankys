from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy.orm import sessionmaker
# import .env

sqlite_file_name = "bankys.db"
sqlite_url = f"sqlite:///{sqlite_file_name}" # Appler une var d'environnement pour le chemin vers la base de données SQLite

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

# Factory de sessions pour une utilisation dynamique
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db_and_tables():
    """
    Crée les tables dans la base de données si elles n'existent pas.
    """
    SQLModel.metadata.create_all(engine)

def get_session():
    """
    Fournit une session à utiliser dans les endpoints FastAPI.
    """
    with Session(engine) as session:
        yield session
