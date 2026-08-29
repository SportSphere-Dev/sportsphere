from pydantic import BaseModel


class AddOnCreate(BaseModel):
    name: str
    description: str | None = None
    price: int


class AddOnUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: int | None = None
    is_active: bool | None = None


class AddOnResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: int
    is_active: bool

    model_config = {"from_attributes": True}