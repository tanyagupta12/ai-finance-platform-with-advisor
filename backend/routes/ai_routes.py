from fastapi import APIRouter
from schemas.ai_schema import AIRequest
from services.ai_service import get_ai_advice

router = APIRouter()

# --------------------------------
# AI Financial Advisor
# --------------------------------
@router.post("/advice")
def ai_advice(data: AIRequest):
    return get_ai_advice(data.query)


# --------------------------------
# GET support
# --------------------------------
@router.get("/")
def ai_get(prompt: str):
    return get_ai_advice(prompt)