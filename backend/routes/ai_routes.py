from fastapi import APIRouter, HTTPException
from schemas.ai_schema import AIRequest
from services.ai_service import get_ai_advice

router = APIRouter()

# --------------------------------
# Helper Function (removes duplication)
# --------------------------------
def generate_response(query: str):
    return {
        "status": "success",
        "data": get_ai_advice(query)
    }

# --------------------------------
# POST: AI Advice
# --------------------------------
@router.post("/advice")
def ai_advice(data: AIRequest):
    try:
        return generate_response(data.query)

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="AI service failed"
        )

# --------------------------------
# GET: AI Advice (query param)
# --------------------------------
@router.get("/")
def ai_get(query: str):
    try:
        return generate_response(query)

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="AI service failed"
        )