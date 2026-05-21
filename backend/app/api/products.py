from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Product
from ..schemas import ProductResponse, ProductListResponse

router = APIRouter()


@router.get("", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    brand: str | None = None,
    category: str | None = None,
    source_platform: str | None = None,
    search: str | None = None,
    sort_by: str = Query("crawled_at", pattern="^(crawled_at|price|sales_rank|release_date)$"),
    db: Session = Depends(get_db),
):
    query = select(Product)

    if brand:
        query = query.where(Product.brand == brand)
    if category:
        query = query.where(Product.category == category)
    if source_platform:
        query = query.where(Product.source_platform == source_platform)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery()))

    order_col = getattr(Product, sort_by)
    items = db.scalars(
        query.order_by(order_col.desc().nullslast())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return ProductListResponse(items=items, total=total or 0, page=page, page_size=page_size)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/brands/list")
def list_brands(db: Session = Depends(get_db)):
    results = db.execute(
        select(Product.brand, func.count(Product.id))
        .group_by(Product.brand)
        .order_by(func.count(Product.id).desc())
    ).all()
    return [{"brand": r[0], "count": r[1]} for r in results]
