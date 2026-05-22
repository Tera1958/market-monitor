from fastapi import APIRouter

router = APIRouter()


@router.get("/reports")
def list_reports():
    return {"message": "Research reports - coming soon", "items": []}


reporting_router = router
