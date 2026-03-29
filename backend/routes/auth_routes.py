from fastapi import APIRouter
from services.auth_service import register_user, login_user
from schemas.auth_schema import UserRegister, UserLogin

router = APIRouter()

@router.post("/register")
def register(data: UserRegister):
    return register_user(data)

 # ----------------------------------------------
# "email": "test@gmail.com","password": "1234"
# ----------------------------------------------

@router.post("/login")
def login(data: UserLogin):
    return login_user(data)