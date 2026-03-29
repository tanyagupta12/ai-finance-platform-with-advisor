import requests
import json
from data_store import portfolio, expenses


# --------------------------------
# Helper: Financial Analysis
# --------------------------------
def analyze_financials():

    transactions = [e for e in expenses if "date" in e]

    total_expense = sum(item["amount"] for item in transactions)

    category_totals = {}
    for item in transactions:
        cat = item["category"]
        category_totals[cat] = category_totals.get(cat, 0) + item["amount"]

    high_spend = max(category_totals, key=category_totals.get) if category_totals else "N/A"

    total_investment = sum(
        s.get("buy_price", 0) * s.get("quantity", 0)
        for s in portfolio
    )

    if total_expense > total_investment:
        risk_flag = "HIGH"
    elif total_expense > 0.7 * total_investment:
        risk_flag = "MEDIUM"
    else:
        risk_flag = "LOW"

    return total_expense, high_spend, risk_flag, total_investment


# --------------------------------
# MAIN SERVICE
# --------------------------------
def get_ai_advice(query: str):

    query = query.strip()
    if not query:
        return {"answer": "Please enter a valid financial question."}

    total_expense, high_spend, risk_flag, total_investment = analyze_financials()

    prompt = f"""
You are a senior financial advisor.

User Financial Summary:
- Total Expense: ₹{total_expense}
- Highest Spending Category: {high_spend}
- Total Investment: ₹{total_investment}
- Risk Level: {risk_flag}

Portfolio:
{json.dumps(portfolio)}

Expenses:
{json.dumps(expenses)}

User Question:
{query}

STRICT INSTRUCTIONS:
- Give EXACTLY 2 bullet points
- Include numbers/percentages
- Be specific (no generic advice)
- Keep under 40 words

FORMAT:
• Point 1  
• Point 2
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "tinyllama",
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )

        if response.status_code != 200:
            raise Exception("Ollama error")

        result = response.json()
        answer = result.get("response", "").strip()

        if not answer:
            raise Exception("Empty response")

    except Exception as e:
        print("AI ERROR:", e)

        answer = f"""
• Reduce {high_spend} spending by 10-20% (₹{int(total_expense*0.1)})
• Invest at least ₹5000 monthly to improve financial stability
"""

    return {
        "answer": answer,
        "meta": {
            "total_expense": total_expense,
            "total_investment": total_investment,
            "risk": risk_flag
        }
    }