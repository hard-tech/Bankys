from fastapi import HTTPException

class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str, error_code: str = None):
        super().__init__(
            status_code=status_code,
            detail={
                "message": detail,
                "error_code": error_code,
                "status": status_code
            }
        )