import uuid
from datetime import datetime

from sqlalchemy import String, Text, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str | None] = mapped_column(String(36))
    title: Mapped[str] = mapped_column(String(300))
    content: Mapped[str | None] = mapped_column(Text)
    report_type: Mapped[str] = mapped_column(String(50), default="findings")
    status: Mapped[str] = mapped_column(String(20), default="draft")
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
