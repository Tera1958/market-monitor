from fastapi import APIRouter

router = APIRouter()


@router.get("/insights")
def list_insights():
    return {"message": "Insight synthesis - coming soon", "items": []}


analysis_router = router
