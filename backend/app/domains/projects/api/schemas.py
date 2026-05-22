from datetime import datetime

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    owner: str | None = None
    methods: dict | None = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str | None
    status: str
    owner: str | None
    methods: dict | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
