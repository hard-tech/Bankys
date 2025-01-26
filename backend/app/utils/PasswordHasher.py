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

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain text password against a hashed password.

    :param plain_password: The plain text password to verify.
    :param hashed_password: The hashed password to compare against.
    :return: True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)