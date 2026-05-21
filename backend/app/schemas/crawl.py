from datetime import datetime

from pydantic import BaseModel


class CrawlTriggerRequest(BaseModel):
    crawler_name: str | None = None


class CrawlTriggerResponse(BaseModel):
    message: str
    crawl_id: str


class CrawlLogResponse(BaseModel):
    id: str
    crawler_name: str
    status: str
    items_found: int
    items_saved: int
    started_at: datetime
    finished_at: datetime | None
    error_message: str | None

    model_config = {"from_attributes": True}
