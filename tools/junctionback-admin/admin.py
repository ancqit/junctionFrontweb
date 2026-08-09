from datetime import datetime
from typing import Annotated
import os

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from .database import users
from .login import get_current_user
from .plan_service import (
    PlanSummary,
    PlanType,
    build_plan_summary,
    initialize_user_plan,
    select_plan_for_user,
)
from .utils import parse_object_id

router = APIRouter(prefix="/admin", tags=["admin"])

ADMIN_PHONE_NUMBERS = {
    number.strip()
    for number in os.getenv("ADMIN_PHONE_NUMBERS", "").split(",")
    if number.strip()
}
ADMIN_EMAILS = {
    email.strip().lower()
    for email in os.getenv("ADMIN_EMAILS", "").split(",")
    if email.strip()
}


class AdminUser(BaseModel):
    id: str
    display_name: str
    phone_number: str | None = None
    email: str | None = None
    is_admin: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None
    plan: PlanSummary


class AdminSetPlanRequest(BaseModel):
    plan_type: PlanType = Field(description="starter | growth | premium")


def require_admin(current_user: Annotated[dict, Depends(get_current_user)]) -> dict:
    if current_user.get("is_admin") is True:
        return current_user
    phone = current_user.get("phone_number") or ""
    email = (current_user.get("email") or "").lower()
    if phone in ADMIN_PHONE_NUMBERS or email in ADMIN_EMAILS:
        return current_user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")


def serialize_admin_user(document: dict) -> AdminUser:
    if document.get("plan") is None:
        initialize_user_plan(document["_id"])
        refreshed = users.find_one({"_id": document["_id"]})
        if refreshed is not None:
            document = refreshed
    return AdminUser(
        id=str(document["_id"]),
        display_name=document.get("display_name") or "Unknown",
        phone_number=document.get("phone_number"),
        email=document.get("email"),
        is_admin=bool(document.get("is_admin")),
        created_at=document.get("created_at"),
        updated_at=document.get("updated_at"),
        plan=build_plan_summary(document),
    )


@router.get("/users", response_model=list[AdminUser])
def list_users(
    _: Annotated[dict, Depends(require_admin)],
    q: str | None = Query(default=None, max_length=160),
) -> list[AdminUser]:
    query: dict = {}
    if q and q.strip():
        term = q.strip()
        query = {
            "$or": [
                {"display_name": {"$regex": term, "$options": "i"}},
                {"phone_number": {"$regex": term, "$options": "i"}},
                {"email": {"$regex": term, "$options": "i"}},
            ]
        }
    documents = users.find(query).sort("created_at", -1).limit(200)
    return [serialize_admin_user(document) for document in documents]


@router.get("/users/{user_id}", response_model=AdminUser)
def get_user(user_id: str, _: Annotated[dict, Depends(require_admin)]) -> AdminUser:
    document = users.find_one({"_id": parse_object_id(user_id, "User")})
    if document is None:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_admin_user(document)


@router.post("/users/{user_id}/plan", response_model=AdminUser)
def set_user_plan(
    user_id: str,
    payload: AdminSetPlanRequest,
    _: Annotated[dict, Depends(require_admin)],
) -> AdminUser:
    if payload.plan_type == PlanType.free_trial:
        raise HTTPException(status_code=400, detail="Free trial cannot be assigned manually")
    object_id = parse_object_id(user_id, "User")
    select_plan_for_user(object_id, payload.plan_type)
    document = users.find_one({"_id": object_id})
    if document is None:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_admin_user(document)


@router.post("/users/{user_id}/activate", response_model=AdminUser)
def activate_user(
    user_id: str,
    payload: AdminSetPlanRequest,
    _: Annotated[dict, Depends(require_admin)],
) -> AdminUser:
    """Re-activate a disabled/expired account by assigning a paid plan."""
    if payload.plan_type == PlanType.free_trial:
        raise HTTPException(status_code=400, detail="Free trial cannot be assigned manually")
    object_id = parse_object_id(user_id, "User")
    select_plan_for_user(object_id, payload.plan_type)
    document = users.find_one({"_id": object_id})
    if document is None:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_admin_user(document)
