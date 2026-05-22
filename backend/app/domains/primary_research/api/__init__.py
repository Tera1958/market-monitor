from fastapi import APIRouter

router = APIRouter()


@router.get("/interviews")
def list_interviews():
    return {"message": "Interview management - coming soon", "items": []}


@router.get("/surveys")
def list_surveys():
    return {"message": "Survey management - coming soon", "items": []}


primary_research_router = router
