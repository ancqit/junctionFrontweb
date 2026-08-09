"""Plan applications (waitlist) for junctionBack.

Apply with locations.py + shop city/locality fields. Wire in main.py:

  from .plan_applications import router as plan_applications_router
  app.include_router(plan_applications_router)

  from .locations import router as locations_router
  app.include_router(locations_router)

Also add to database.py:
  plan_applications = database["plan_applications"]
  cities = database["cities"]
  localities = database["localities"]
"""

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from pymongo import ReturnDocument

from .database import plan_applications, users
from .login import get_current_user
from .plan_service import PLAN_CATALOG, PlanType
from .roles import UserRole, get_user_role

router = APIRouter(prefix="/plans", tags=["plans"])


class PlanApplicationRequest(BaseModel):
    plan_type: PlanType = Field(description="starter | growth | premium")


class PlanApplication(BaseModel):
    id: str
    plan_type: PlanType
    plan_name: str
    status: str
    message: str
    created_at: datetime
    updated_at: datetime | None = None


def serialize_application(document: dict) -> PlanApplication:
    plan_type = PlanType(document["plan_type"])
    plan_name = PLAN_CATALOG[plan_type.value]["name"]
    return PlanApplication(
        id=str(document["_id"]),
        plan_type=plan_type,
        plan_name=plan_name,
        status=document.get("status", "forwarded"),
        message=document.get("message")
        or f"You are added to the list for the {plan_name} plan.",
        created_at=document["created_at"],
        updated_at=document.get("updated_at"),
    )


@router.post("/applications", response_model=PlanApplication, status_code=status.HTTP_201_CREATED)
def create_plan_application(
    payload: PlanApplicationRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
) -> PlanApplication:
    if get_user_role(current_user) == UserRole.admin:
        raise HTTPException(status_code=400, detail="Admins do not join plan lists")
    if payload.plan_type == PlanType.free_trial:
        raise HTTPException(status_code=400, detail="Free trial cannot be requested manually")

    plan_applications.create_index([("user_id", 1), ("status", 1)])
    now = datetime.now(timezone.utc)
    plan_name = PLAN_CATALOG[payload.plan_type.value]["name"]
    message = f"You are added to the list for the {plan_name} plan."

    document = plan_applications.find_one_and_update(
        {"user_id": str(current_user["_id"]), "status": {"$in": ["forwarded", "pending"]}},
        {
            "$set": {
                "plan_type": payload.plan_type.value,
                "status": "forwarded",
                "message": message,
                "updated_at": now,
            },
            "$setOnInsert": {
                "user_id": str(current_user["_id"]),
                "created_at": now,
            },
        },
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )

    # Record selected intent on the user without activating paid access yet.
    users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "plan.selected_plan_type": payload.plan_type.value,
                "plan.application_status": "forwarded",
                "plan.application_submitted_at": now,
                "updated_at": now,
            }
        },
    )
    return serialize_application(document)


@router.get("/applications/me", response_model=PlanApplication | None)
def get_my_plan_application(
    current_user: Annotated[dict, Depends(get_current_user)],
) -> PlanApplication | None:
    document = plan_applications.find_one(
        {"user_id": str(current_user["_id"])},
        sort=[("created_at", -1)],
    )
    if document is None:
        return None
    return serialize_application(document)
