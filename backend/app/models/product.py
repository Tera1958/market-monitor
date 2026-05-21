import uuid
from datetime import date, datetime

from sqlalchemy import String, Text, Integer, Date, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200))
    brand: Mapped[str] = mapped_column(String(100))
    category: Mapped[str | None] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[dict | None] = mapped_column(JSON)
    specs: Mapped[dict | None] = mapped_column(JSON)
    source_platform: Mapped[str] = mapped_column(String(50))
    source_url: Mapped[str] = mapped_column(String(1000), unique=True)
    release_date: Mapped[date | None] = mapped_column(Date)
    sales_rank: Mapped[int | None] = mapped_column(Integer)
    crawled_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
