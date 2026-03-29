from fastapi import APIRouter, HTTPException
from datetime import datetime
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
# ADD EXPENSE
# --------------------------------
@router.post("/add")
def add_expense(data: Expense):
    return add_expense_service(data)


# --------------------------------
# SUMMARY
# --------------------------------
@router.get("/summary")
def expense_summary():
    return get_summary_service()


# --------------------------------
# DETAILED ANALYSIS
# --------------------------------
@router.get("/detailed")
def detailed_analysis():
    return get_detailed_service()


# --------------------------------
# MONTHLY TREND
# --------------------------------
@router.get("/trend")
def expense_trend():
    return get_trend_service()


# --------------------------------
# STRUCTURED EXPENSES
# --------------------------------
@router.get("/expenses")
def get_expenses():
    return get_expenses_service()


# --------------------------------
# FINAL INSIGHTS
# --------------------------------
@router.get("/insights")
def get_insights():
    return get_insights_service()