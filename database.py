# database.py
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent
DATABASE_URL = f"sqlite:///{BASE_DIR}/salaries.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SalaryRecord(Base):
    __tablename__ = "salaries"

    id = Column(Integer, primary_key=True, index=True)
    position = Column(String, index=True)           # например "Python Developer"
    grade = Column(String)                          # Junior / Middle / Senior / Lead
    city = Column(String)
    salary_from = Column(Float, nullable=True)
    salary_to = Column(Float, nullable=True)
    salary_avg = Column(Float, nullable=True)        # если сразу средняя
    source = Column(String)                         # hh.ru, superjob, telegram и т.д.
    date_added = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

# Создаём базу и таблицу при первом запуске
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()