from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select, cast, String
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Article
from ..schemas import ArticleResponse, ArticleListResponse

router = APIRouter()


@router.get("", response_model=ArticleListResponse)
def list_articles(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    source_platform: str | None = None,
    category: str | None = None,
    brand: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Article)

    if source_platform:
        query = query.where(Article.source_platform == source_platform)
    if category:
        query = query.where(Article.category == category)
    if brand:
        query = query.where(cast(Article.brands_mentioned, String).ilike(f"%{brand}%"))
    if search:
        query = query.where(Article.title.ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery()))
    items = db.scalars(
        query.order_by(Article.published_at.desc().nullslast())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return ArticleListResponse(items=items, total=total or 0, page=page, page_size=page_size)


@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: str, db: Session = Depends(get_db)):
    article = db.get(Article, article_id)
    if not article:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/sources/list")
def list_sources(db: Session = Depends(get_db)):
    results = db.execute(
        select(Article.source_platform, func.count(Article.id))
        .group_by(Article.source_platform)
    ).all()
    return [{"platform": r[0], "count": r[1]} for r in results]
