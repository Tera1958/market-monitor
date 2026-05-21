import uuid
from datetime import datetime

from sqlalchemy import String, Text, DateTime, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from ..database import Base


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(500))
    summary: Mapped[str | None] = mapped_column(Text)
    content: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str] = mapped_column(String(1000), unique=True)
    source_platform: Mapped[str] = mapped_column(String(50))
    source_name: Mapped[str | None] = mapped_column(String(100))
    category: Mapped[str | None] = mapped_column(String(50))
    brands_mentioned: Mapped[dict | None] = mapped_column(JSON)
    published_at: Mapped[datetime | None] = mapped_column(DateTime)
    crawled_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500))
