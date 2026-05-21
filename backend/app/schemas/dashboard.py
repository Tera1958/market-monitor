from datetime import datetime

from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_articles: int
    total_products: int
    today_articles: int
    today_products: int
    active_brands: int
    last_crawl_time: datetime | None
    sources_count: dict[str, int]
