from fastapi import HTTPException
from utils.auth_utils import create_access_token

users = [
    {"email": "test@gmail.com", "password": "1234"}
]

# --------------------------------
# REGISTER
# --------------------------------
def register_user(data):
    email = data.email.lower().strip()
    password = data.password

    for u in users:
        if u["email"] == email:
            raise HTTPException(status_code=400, detail="User already exists")

    users.append({
        "email": email,
        "password": password
    })

    return {
        "message": "User registered successfully"
    }


# --------------------------------
# LOGIN
# --------------------------------
def login_user(data):
    email = data.email.lower().strip()
    password = data.password

    for u in users:
        if u["email"] == email and u["password"] == password:

            token = create_access_token({"sub": email})

            return {
                "access_token": token,
                "token_type": "bearer"
            }

    raise HTTPException(status_code=401, detail="Invalid credentials")