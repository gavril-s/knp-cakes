from fastapi import APIRouter, HTTPException, Request
from .models import Cake, SessionLocal
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter()

@router.post("/contact")
async def contact(request: Request):
    data = await request.json()
    # Здесь можно добавить отправку email или сохранение в базу данных
    print(f"Новое сообщение от {data.get('name')} ({data.get('email')}): {data.get('message')}")
    return {"message": "Сообщение успешно получено"}

@router.get("/cakes")
def get_cakes():
    db = SessionLocal()
    cakes = db.query(Cake).all()
    db.close()
    return cakes

@router.get("/cakes/{cake_id}")
def get_cake(cake_id: int):
    db = SessionLocal()
    cake = db.query(Cake).filter(Cake.id == cake_id).first()
    db.close()
    if cake is None:
        raise HTTPException(status_code=404, detail="Торт не найден")
    return cake

@router.post("/cakes")
def create_cake(cake: dict):
    db = SessionLocal()
    db_cake = Cake(
        name=cake["name"],
        description=cake["description"],
        price=cake["price"],
    )
    db.add(db_cake)
    db.commit()
    db.refresh(db_cake)
    db.close()
    return db_cake

@router.put("/cakes/{cake_id}")
def update_cake(cake_id: int, cake: dict):
    db = SessionLocal()
    db_cake = db.query(Cake).filter(Cake.id == cake_id).first()
    if not db_cake:
        db.close()
        raise HTTPException(status_code=404, detail="Торт не найден")
    
    db_cake.name = cake.get("name", db_cake.name)
    db_cake.description = cake.get("description", db_cake.description)
    db_cake.price = cake.get("price", db_cake.price)
    
    db.commit()
    db.refresh(db_cake)
    db.close()
    return db_cake

@router.delete("/cakes/{cake_id}")
def delete_cake(cake_id: int):
    db = SessionLocal()
    db_cake = db.query(Cake).filter(Cake.id == cake_id).first()
    if not db_cake:
        db.close()
        raise HTTPException(status_code=404, detail="Торт не найден")
    
    db.delete(db_cake)
    db.commit()
    db.close()
    return {"message": "Торт успешно удален"}

@router.get("/cakes/search")
def search_cakes(query: str):
    db = SessionLocal()
    cakes = db.query(Cake).filter(
        (Cake.name.ilike(f"%{query}%")) |
        (Cake.description.ilike(f"%{query}%"))
    ).all()
    db.close()
    return cakes
