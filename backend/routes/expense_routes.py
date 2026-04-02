from fastapi import APIRouter, HTTPException
from models.expense_model import Expense

from services.expense_service import (
    add_expense_service,
    get_summary_service,
    get_detailed_service,
    get_trend_service,
    get_expenses_service,
    get_insights_service
)

router = APIRouter()

# --------------------------------
# Helper (avoid repetition)
# --------------------------------
def success_response(data):
    return {"status": "success", "data": data}


# --------------------------------
# ADD EXPENSE
# --------------------------------
@router.post("/add")
def add_expense(data: Expense):
    try:
        return success_response(add_expense_service(data))
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to add expense")


# --------------------------------
# SUMMARY
# --------------------------------
@router.get("/summary")
def expense_summary():
    try:
        return success_response(get_summary_service())
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch summary")


# --------------------------------
# DETAILED ANALYSIS
# --------------------------------
@router.get("/detailed")
def detailed_analysis():
    try:
        return success_response(get_detailed_service())
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch detailed analysis")


# --------------------------------
# MONTHLY TREND
# --------------------------------
@router.get("/trend")
def expense_trend():
    try:
        return success_response(get_trend_service())
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch trend")


# --------------------------------
# STRUCTURED EXPENSES
# --------------------------------
@router.get("/expenses")
def get_expenses():
    try:
        return success_response(get_expenses_service())
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch expenses")


# --------------------------------
# FINAL INSIGHTS
# --------------------------------
@router.get("/insights")
def get_insights():
    try:
        return success_response(get_insights_service())
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch insights")