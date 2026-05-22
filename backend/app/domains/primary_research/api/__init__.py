import os
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.config import settings
from ..models import Interview

router = APIRouter()

UPLOAD_DIR = Path("uploads/transcripts")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR = Path("outputs/transcripts")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _process_transcript(interview_id: str, input_path: str):
    """Background task to process a transcript."""
    from ..qualitative.transcript_cleaner import clean_transcript

    db = SessionLocal()
    try:
        interview = db.get(Interview, interview_id)
        if not interview:
            return

        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            interview.status = "failed"
            db.commit()
            return

        try:
            output_path = clean_transcript(input_path, str(OUTPUT_DIR), api_key)
            interview.transcript_cleaned = output_path
            interview.status = "completed"
        except Exception as e:
            interview.status = "failed"
            interview.metadata_ = {"error": str(e)}

        db.commit()
    finally:
        db.close()


@router.post("/interviews/transcript/upload")
async def upload_transcript(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="请上传 .docx 格式文件")

    file_id = str(uuid.uuid4())
    save_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)

    interview = Interview(
        title=Path(file.filename).stem,
        status="processing",
        transcript_raw=str(save_path),
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    background_tasks.add_task(_process_transcript, interview.id, str(save_path))

    return {
        "id": interview.id,
        "status": "processing",
        "message": f"文件 '{file.filename}' 已上传，正在处理中",
    }


@router.get("/interviews/transcript/download/{interview_id}")
def download_transcript(interview_id: str, db: Session = Depends(get_db)):
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="记录不存在")

    if interview.status != "completed":
        raise HTTPException(status_code=400, detail=f"文件尚未处理完成，当前状态：{interview.status}")

    if not interview.transcript_cleaned or not os.path.exists(interview.transcript_cleaned):
        raise HTTPException(status_code=404, detail="清洗后文件不存在")

    filename = Path(interview.transcript_cleaned).name
    return FileResponse(
        interview.transcript_cleaned,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=filename,
    )


@router.get("/interviews/transcript/status/{interview_id}")
def get_transcript_status(interview_id: str, db: Session = Depends(get_db)):
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="记录不存在")

    return {
        "id": interview.id,
        "title": interview.title,
        "status": interview.status,
        "created_at": interview.created_at.isoformat(),
        "error": interview.metadata_.get("error") if interview.metadata_ else None,
    }


@router.get("/interviews")
def list_interviews(db: Session = Depends(get_db)):
    interviews = db.scalars(
        select(Interview).order_by(Interview.created_at.desc()).limit(50)
    ).all()
    return [
        {
            "id": i.id,
            "title": i.title,
            "status": i.status,
            "created_at": i.created_at.isoformat(),
        }
        for i in interviews
    ]


@router.get("/surveys")
def list_surveys():
    return {"message": "Survey management - coming soon", "items": []}


primary_research_router = router
