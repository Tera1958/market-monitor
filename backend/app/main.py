from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import api_router
from .config import settings
from .database import engine, Base
from .domains.projects.api import projects_router
from .domains.primary_research.api import primary_research_router
from .domains.analysis.api import analysis_router
from .domains.reporting.api import reporting_router

app = FastAPI(title=settings.app_name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
app.include_router(primary_research_router, prefix="/api/primary", tags=["primary-research"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["analysis"])
app.include_router(reporting_router, prefix="/api/reporting", tags=["reporting"])


@app.on_event("startup")
def startup():
    from .domains.projects.models import Project
    from .domains.primary_research.models import Interview, Survey
    from .domains.analysis.models import Insight
    from .domains.reporting.models import Report
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}
