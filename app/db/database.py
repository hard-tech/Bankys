from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./bankys.db"  # Remplacez par votre URL de base de données

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def get_db():
    with Session(engine) as session:
        yield session

# Ensure tables are created
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)