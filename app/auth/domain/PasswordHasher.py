from passlib.context import CryptContext

# Create a CryptContext object for hashing passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """
    Hashes a password using bcrypt.

    :param password: The plain text password to hash.
    :return: The hashed password.
    """
    return pwd_context.hash(password)
