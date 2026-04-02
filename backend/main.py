from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers
from routes.auth_routes import router as auth_router
from routes.secure_routes import router as secure_router
from routes.expense_routes import router as expense_router
from routes.portfolio_routes import router as portfolio_router
from routes.ai_routes import router as ai_router
from routes.stock_routes import router as stock_router

app = FastAPI(
    title="AI Finance Platform API",
    description="APIs for stock tracking, portfolio management, expense analytics, and AI financial advice",
    version="1.0.0",
    contact={
        "name": "Tanya Gupta"
    }
)

# --------------------------------
# CORS
# --------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------
# Routers
# --------------------------------
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(secure_router, tags=["Secure"])
app.include_router(expense_router, prefix="/expense", tags=["Expense"])
app.include_router(portfolio_router, prefix="/portfolio", tags=["Portfolio"])
app.include_router(ai_router, prefix="/ai", tags=["AI Advisor"])
app.include_router(stock_router, prefix="/stock", tags=["Stock"])
# --------------------------------
# Root
# --------------------------------
@app.get("/")
def home():
    return {
        "message": "AI Finance Platform API running 🚀",
        "status": "OK"
    }