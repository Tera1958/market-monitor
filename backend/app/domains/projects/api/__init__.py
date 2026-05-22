from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.database import get_db
from .schemas import ProjectCreate, ProjectResponse
from ..models import Project

router = APIRouter()


@router.get("", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    projects = db.scalars(
        select(Project).order_by(Project.created_at.desc())
    ).all()
    return projects


@router.post("", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        name=data.name,
        description=data.description,
        owner=data.owner,
        methods=data.methods,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


projects_router = router
