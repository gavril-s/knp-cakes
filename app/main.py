from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer
from .routes import router
from .auth_routes import router as auth_router
from .auth import get_current_user
from .models import User
from .database import Base, engine

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(router)
app.include_router(auth_router, prefix="/auth", tags=["auth"])

templates = Jinja2Templates(directory="templates")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

@app.get("/")
async def read_root(request: Request, current_user: User = Depends(get_current_user)):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "user": current_user
    })

@app.get("/profile")
async def read_profile(request: Request, current_user: User = Depends(get_current_user)):
    return templates.TemplateResponse("profile.html", {
        "request": request,
        "user": current_user
    })

@app.get("/auth")
async def auth_page(request: Request):
    return templates.TemplateResponse("auth.html", {"request": request})
