import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db, SessionLocal
from ..models import CrawlLog
from ..schemas import CrawlTriggerRequest, CrawlTriggerResponse, CrawlLogResponse
from ..crawlers import get_crawler, get_all_crawler_names

router = APIRouter()


def run_crawler_task(crawler_name: str, crawl_log_id):
    db = SessionLocal()
    try:
        log = db.get(CrawlLog, crawl_log_id)
        crawler = get_crawler(crawler_name)
        if not crawler:
            log.status = "failed"
            log.error_message = f"Crawler '{crawler_name}' not found"
            log.finished_at = datetime.now(timezone.utc)
            db.commit()
            return

        try:
            result = crawler.run()
            log.status = "success"
            log.items_found = result.get("items_found", 0)
            log.items_saved = result.get("items_saved", 0)
        except Exception as e:
            log.status = "failed"
            log.error_message = str(e)
        finally:
            log.finished_at = datetime.now(timezone.utc)
            db.commit()
    finally:
        db.close()


@router.post("/trigger", response_model=CrawlTriggerResponse)
def trigger_crawl(
    request: CrawlTriggerRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    crawler_name = request.crawler_name or "all"
    log = CrawlLog(crawler_name=crawler_name, status="running")
    db.add(log)
    db.commit()
    db.refresh(log)

    if request.crawler_name:
        background_tasks.add_task(run_crawler_task, request.crawler_name, log.id)
    else:
        for name in get_all_crawler_names():
            sub_log = CrawlLog(crawler_name=name, status="running")
            db.add(sub_log)
            db.commit()
            db.refresh(sub_log)
            background_tasks.add_task(run_crawler_task, name, sub_log.id)

    return CrawlTriggerResponse(message=f"Crawl triggered: {crawler_name}", crawl_id=log.id)


@router.get("/logs", response_model=list[CrawlLogResponse])
def list_crawl_logs(limit: int = 20, db: Session = Depends(get_db)):
    logs = db.scalars(
        select(CrawlLog).order_by(CrawlLog.started_at.desc()).limit(limit)
    ).all()
    return logs


@router.get("/status")
def crawl_status(db: Session = Depends(get_db)):
    names = get_all_crawler_names()
    status = {}
    for name in names:
        last_log = db.scalar(
            select(CrawlLog)
            .where(CrawlLog.crawler_name == name)
            .order_by(CrawlLog.started_at.desc())
            .limit(1)
        )
        status[name] = {
            "last_status": last_log.status if last_log else "never_run",
            "last_run": last_log.started_at.isoformat() if last_log else None,
            "items_saved": last_log.items_saved if last_log else 0,
        }
    return status
