from fastapi import APIRouter

from .articles import router as articles_router
from .products import router as products_router
from .crawl import router as crawl_router
from .dashboard import router as dashboard_router

api_router = APIRouter()
api_router.include_router(articles_router, prefix="/articles", tags=["articles"])
api_router.include_router(products_router, prefix="/products", tags=["products"])
api_router.include_router(crawl_router, prefix="/crawl", tags=["crawl"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
