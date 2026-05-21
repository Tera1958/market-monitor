from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select, distinct
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Article, Product, CrawlLog
from ..schemas import DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    total_articles = db.scalar(select(func.count(Article.id))) or 0
    total_products = db.scalar(select(func.count(Product.id))) or 0

    today_articles = db.scalar(
        select(func.count(Article.id)).where(Article.crawled_at >= today_start)
    ) or 0
    today_products = db.scalar(
        select(func.count(Product.id)).where(Product.crawled_at >= today_start)
    ) or 0

    active_brands = db.scalar(select(func.count(distinct(Product.brand)))) or 0

    last_log = db.scalar(
        select(CrawlLog).order_by(CrawlLog.started_at.desc()).limit(1)
    )
    last_crawl_time = last_log.started_at if last_log else None

    source_counts = db.execute(
        select(Article.source_platform, func.count(Article.id))
        .group_by(Article.source_platform)
    ).all()
    sources_count = {r[0]: r[1] for r in source_counts}

    return DashboardStats(
        total_articles=total_articles,
        total_products=total_products,
        today_articles=today_articles,
        today_products=today_products,
        active_brands=active_brands,
        last_crawl_time=last_crawl_time,
        sources_count=sources_count,
    )
