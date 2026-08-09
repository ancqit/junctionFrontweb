"""City / locality catalogs for Overview shop form.

Wire in main.py:
  from .locations import router as locations_router
  app.include_router(locations_router)

database.py:
  cities = database["cities"]
  localities = database["localities"]
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field

from .database import cities, localities
from .login import get_current_user

router = APIRouter(prefix="/locations", tags=["locations"])

# Seed defaults used when Mongo collections are empty.
DEFAULT_CITIES = ["Ranchi", "Jamshedpur", "Dhanbad"]
DEFAULT_LOCALITIES: dict[str, list[str]] = {
    "Ranchi": ["Main Road", "Lalpur", "Doranda", "Kanke"],
    "Jamshedpur": ["Bistupur", "Sakchi", "Kadma"],
    "Dhanbad": ["Bank More", "Hirapur"],
}


class LocationValue(BaseModel):
    name: str = Field(min_length=1, max_length=120)


@router.get("/cities", response_model=list[str])
def list_cities(_: Annotated[dict, Depends(get_current_user)]) -> list[str]:
    rows = [str(doc["name"]).strip() for doc in cities.find().sort("name", 1) if doc.get("name")]
    return rows or list(DEFAULT_CITIES)


@router.get("/localities", response_model=list[str])
def list_localities(
    _: Annotated[dict, Depends(get_current_user)],
    city: str = Query(min_length=1, max_length=120),
) -> list[str]:
    key = city.strip()
    rows = [
        str(doc["name"]).strip()
        for doc in localities.find({"city": {"$regex": f"^{key}$", "$options": "i"}}).sort("name", 1)
        if doc.get("name")
    ]
    if rows:
        return rows
    for known, values in DEFAULT_LOCALITIES.items():
        if known.lower() == key.lower():
            return list(values)
    return []
