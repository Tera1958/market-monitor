from datetime import date, datetime

from pydantic import BaseModel


class ProductResponse(BaseModel):
    id: str
    name: str
    brand: str
    category: str | None
    description: str | None
    price: dict | None
    specs: dict | None
    source_platform: str
    source_url: str
    release_date: date | None
    sales_rank: int | None
    crawled_at: datetime

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
