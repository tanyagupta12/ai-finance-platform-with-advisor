from fastapi import HTTPException
from datetime import datetime
from data_store import expenses

# --------------------------------
# Categories Init
# --------------------------------
categories = set(["food", "travel"])

for cat in categories:
    if not any(e.get("category") == cat and "date" not in e for e in expenses):
        expenses.append({"category": cat, "amount": 0})


# --------------------------------
# HELPER
# --------------------------------
def calculate_summary():
    summary = {}
    total = 0

    for e in expenses:
        if "date" not in e:
            summary[e["category"]] = e["amount"]
            total += e["amount"]

    return summary, total


def generate_insights(categories_data):
    insights = [
        f"High spending on {c['category']}"
        for c in categories_data if c["percentage"] > 40
    ]
    return insights if insights else ["Spending is balanced"]


# --------------------------------
# SERVICES
# --------------------------------
def add_expense_service(data):
    category = data.category.lower().strip()   # ✅ FIX
    amount = data.amount
    date = data.date or datetime.now().strftime("%Y-%m-%d")

    if category not in categories:
        raise HTTPException(status_code=400, detail="Invalid category")

    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid amount")

    for e in expenses:
        if e.get("category") == category and "date" not in e:
            e["amount"] += amount
            break

    expenses.append({
        "category": category,
        "amount": amount,
        "date": date
    })

    return {"message": "Expense added successfully"}


def get_summary_service():
    summary, total = calculate_summary()
    return {"total": total, "data": summary}


def get_detailed_service():
    summary, total = calculate_summary()

    result = []
    for cat, amount in summary.items():
        percentage = round((amount / total) * 100, 2) if total else 0
        result.append({
            "category": cat,
            "amount": amount,
            "percentage": percentage
        })

    insights = generate_insights(result)

    return {"data": result, "insights": insights}


def get_trend_service():
    trend = {}

    for e in expenses:
        if "date" in e:
            month = e["date"][:7]
            trend[month] = trend.get(month, 0) + e["amount"]

    return {"trend": trend}


def get_expenses_service():
    summary, total = calculate_summary()

    categories_data = [
        {"name": cat, "amount": amt}
        for cat, amt in summary.items()
    ]

    return {
        "total": total,
        "categories": categories_data
    }


def get_insights_service():
    summary, total = calculate_summary()

    categories_data = []
    for cat, amt in summary.items():
        percentage = round((amt / total) * 100, 2) if total else 0

        categories_data.append({
            "category": cat,
            "amount": amt,
            "percentage": percentage
        })

    insights = generate_insights(categories_data)

    return {
        "total": total,
        "categories": categories_data,
        "insights": insights
    }