from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from pymongo import ReturnDocument

from .database import users
from .login import get_current_user

router = APIRouter(prefix="/plans", tags=["plans"])

TRIAL_DAYS = 15


class PlanId(str, Enum):
    starter = "starter"
    growth = "growth"
    premium = "premium"


class SubscriptionStatus(str, Enum):
    none = "none"
    trial = "trial"
    active = "active"
    expired = "expired"


class PlanCatalogItem(BaseModel):
    id: PlanId
    name: str
    price_inr: int = Field(ge=0)
    product_limit: int | None = Field(
        default=None,
        description="Maximum products allowed. None means more than 150 / effectively unlimited for Premium.",
    )
    description: str
    features: list[str]


class SelectPlanRequest(BaseModel):
    plan_id: PlanId


class SubscriptionState(BaseModel):
    status: SubscriptionStatus
    plan_id: PlanId | None = None
    plan_name: str | None = None
    product_limit: int | None = None
    price_inr: int | None = None
    trial_started_at: datetime | None = None
    trial_ends_at: datetime | None = None
    trial_days_total: int = TRIAL_DAYS
    trial_days_remaining: int | None = None
    selected_at: datetime | None = None


PLAN_CATALOG: dict[PlanId, PlanCatalogItem] = {
    PlanId.starter: PlanCatalogItem(
        id=PlanId.starter,
        name="Starter",
        price_inr=0,
        product_limit=0,
        description="Get a Junction profile and explore the workspace.",
        features=["Store profile", "Overview access", "Upgrade anytime"],
    ),
    PlanId.growth: PlanCatalogItem(
        id=PlanId.growth,
        name="Growth",
        price_inr=299,
        product_limit=100,
        description="Add up to 100 products and run your catalog.",
        features=["Up to 100 products", "Orders & billing", "Employee records"],
    ),
    PlanId.premium: PlanCatalogItem(
        id=PlanId.premium,
        name="Premium",
        price_inr=599,
        product_limit=None,
        description="Add more than 150 products with full store operations.",
        features=["More than 150 products", "Orders & billing", "Priority catalog tools"],
    ),
}


def catalog_list() -> list[PlanCatalogItem]:
    return [PLAN_CATALOG[PlanId.starter], PLAN_CATALOG[PlanId.growth], PLAN_CATALOG[PlanId.premium]]


def compute_trial_remaining(trial_ends_at: datetime | None, now: datetime) -> int | None:
    if trial_ends_at is None:
        return None
    ends = trial_ends_at if trial_ends_at.tzinfo else trial_ends_at.replace(tzinfo=timezone.utc)
    seconds = (ends - now).total_seconds()
    if seconds <= 0:
        return 0
    return int((seconds + 86_399) // 86_400)


def build_subscription_state(user: dict, now: datetime | None = None) -> SubscriptionState:
    now = now or datetime.now(timezone.utc)
    plan_id_raw = user.get("plan_id")
    plan_id = PlanId(plan_id_raw) if plan_id_raw in PlanId._value2member_map_ else None
    status_raw = user.get("subscription_status") or SubscriptionStatus.none.value
    trial_started_at = user.get("trial_started_at")
    trial_ends_at = user.get("trial_ends_at")
    selected_at = user.get("plan_selected_at")

    if status_raw == SubscriptionStatus.trial.value:
        days_remaining = compute_trial_remaining(trial_ends_at, now)
        if days_remaining is not None and days_remaining <= 0:
            users.update_one(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "subscription_status": SubscriptionStatus.expired.value,
                        "updated_at": now,
                    }
                },
            )
            return SubscriptionState(
                status=SubscriptionStatus.expired,
                plan_id=plan_id,
                plan_name=PLAN_CATALOG[plan_id].name if plan_id else "Premium trial",
                product_limit=0,
                price_inr=PLAN_CATALOG[plan_id].price_inr if plan_id else None,
                trial_started_at=trial_started_at,
                trial_ends_at=trial_ends_at,
                trial_days_remaining=0,
                selected_at=selected_at,
            )
        premium = PLAN_CATALOG[PlanId.premium]
        return SubscriptionState(
            status=SubscriptionStatus.trial,
            plan_id=PlanId.premium,
            plan_name="Premium (Free trial)",
            product_limit=premium.product_limit,
            price_inr=0,
            trial_started_at=trial_started_at,
            trial_ends_at=trial_ends_at,
            trial_days_remaining=days_remaining,
            selected_at=selected_at,
        )

    if plan_id and status_raw == SubscriptionStatus.active.value:
        plan = PLAN_CATALOG[plan_id]
        return SubscriptionState(
            status=SubscriptionStatus.active,
            plan_id=plan.id,
            plan_name=plan.name,
            product_limit=plan.product_limit,
            price_inr=plan.price_inr,
            trial_started_at=trial_started_at,
            trial_ends_at=trial_ends_at,
            trial_days_remaining=None,
            selected_at=selected_at,
        )

    if status_raw == SubscriptionStatus.expired.value:
        return SubscriptionState(
            status=SubscriptionStatus.expired,
            plan_id=plan_id,
            plan_name=PLAN_CATALOG[plan_id].name if plan_id else None,
            product_limit=0,
            price_inr=PLAN_CATALOG[plan_id].price_inr if plan_id else None,
            trial_started_at=trial_started_at,
            trial_ends_at=trial_ends_at,
            trial_days_remaining=0,
            selected_at=selected_at,
        )

    return SubscriptionState(status=SubscriptionStatus.none)


@router.get("", response_model=list[PlanCatalogItem])
def list_plans() -> list[PlanCatalogItem]:
    return catalog_list()


@router.get("/me", response_model=SubscriptionState)
def get_my_plan(current_user: Annotated[dict, Depends(get_current_user)]) -> SubscriptionState:
    return build_subscription_state(current_user)


@router.post("/trial/start", response_model=SubscriptionState, status_code=status.HTTP_201_CREATED)
def start_free_trial(current_user: Annotated[dict, Depends(get_current_user)]) -> SubscriptionState:
    now = datetime.now(timezone.utc)
    state = build_subscription_state(current_user, now)
    if state.status == SubscriptionStatus.trial:
        raise HTTPException(status_code=409, detail="Free trial is already active")
    if state.status == SubscriptionStatus.active and state.plan_id == PlanId.premium:
        raise HTTPException(status_code=409, detail="Premium plan is already active")
    if current_user.get("trial_started_at") and state.status == SubscriptionStatus.expired:
        raise HTTPException(status_code=409, detail="Free trial has already been used")

    trial_ends_at = now + timedelta(days=TRIAL_DAYS)
    user = users.find_one_and_update(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "plan_id": PlanId.premium.value,
                "subscription_status": SubscriptionStatus.trial.value,
                "trial_started_at": now,
                "trial_ends_at": trial_ends_at,
                "plan_selected_at": now,
                "updated_at": now,
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    return build_subscription_state(user, now)


@router.post("/select", response_model=SubscriptionState)
def select_plan(
    payload: SelectPlanRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
) -> SubscriptionState:
    now = datetime.now(timezone.utc)
    plan = PLAN_CATALOG[payload.plan_id]
    user = users.find_one_and_update(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "plan_id": plan.id.value,
                "subscription_status": SubscriptionStatus.active.value,
                "plan_selected_at": now,
                "updated_at": now,
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    return build_subscription_state(user, now)
