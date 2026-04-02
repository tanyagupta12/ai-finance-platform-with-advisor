from fastapi import APIRouter, Depends
from utils.dependencies import get_current_user

router = APIRouter()

@router.get("/secure-data")
def secure_data(user: str = Depends(get_current_user)):
    return {
        "status": "success",
        "data": {
            "message": f"Hello {user}, this is protected"
        }
    }