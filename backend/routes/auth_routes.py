from fastapi import APIRouter, HTTPException
from services.auth_service import register_user, login_user
from schemas.auth_schema import UserRegister, UserLogin

router = APIRouter()

# --------------------------------
# REGISTER
# --------------------------------
@router.post("/register")
def register(data: UserRegister):
    try:
        result = register_user(data)
        return {
            "status": "success",
            "data": result
        }
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=500, detail="Registration failed")


# --------------------------------
# LOGIN
# --------------------------------
@router.post("/login")
def login(data: UserLogin):
    try:
        result = login_user(data)
        return {
            "status": "success",
            "data": result
        }
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=500, detail="Login failed")