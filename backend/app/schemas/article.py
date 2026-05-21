from datetime import datetime

from pydantic import BaseModel


class ArticleResponse(BaseModel):
    id: str
    title: str
    summary: str | None
    url: str
    source_platform: str
    source_name: str | None
    category: str | None
    brands_mentioned: dict | None
    published_at: datetime | None
    crawled_at: datetime
    thumbnail_url: str | None

    model_config = {"from_attributes": True}


class ArticleListResponse(BaseModel):
    items: list[ArticleResponse]
    total: int
    page: int
    page_size: int
