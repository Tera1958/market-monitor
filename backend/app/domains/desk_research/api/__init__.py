from fastapi import APIRouter

from app.api.articles import router as articles_router
from app.api.products import router as products_router
from app.api.crawl import router as crawl_router

desk_research_router = APIRouter()
desk_research_router.include_router(articles_router, prefix="/articles", tags=["desk-research/articles"])
desk_research_router.include_router(products_router, prefix="/products", tags=["desk-research/products"])
desk_research_router.include_router(crawl_router, prefix="/crawl", tags=["desk-research/crawl"])
