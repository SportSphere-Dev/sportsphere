from pydantic import BaseModel


class SportCreate(BaseModel):
    name: str
    description: str | None = None
    price_per_hour: int


class SportResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price_per_hour: int
    is_active: bool

    model_config = {"from_attributes": True}