from pydantic import BaseModel


class Box(BaseModel):
    x: float
    y: float
    width: float
    height: float
    label: str


class Point(BaseModel):
    x: float
    y: float
