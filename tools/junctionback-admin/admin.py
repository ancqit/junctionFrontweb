from datetime import datetime, timezone
from typing import Annotated, Any
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


def _products_collection():
    try:
        from .database import products  # type: ignore

        return products
    except ImportError:
        from .database import db  # type: ignore

        return db.products


class AdminUser(BaseModel):
    id: str
    display_name: str
    phone_number: str | None = None
    email: str | None = None
    is_admin: bool = False
    role: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    plan: PlanSummary


class AdminShop(BaseModel):
    id: str
    name: str
    store_id: str
    owner_id: str
    owner_name: str
    phone_number: str | None = None
    email: str | None = None
    products_count: int = 0
    is_active: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None


class AdminSetPlanRequest(BaseModel):
    plan_type: PlanType = Field(description="starter | growth | premium")


class AdminShopStatusRequest(BaseModel):
    is_active: bool


def _user_role(document: dict) -> str:
    return str(document.get("role") or document.get("user_type") or "").strip().lower()


def _is_admin_user(document: dict) -> bool:
    if _user_role(document) == "admin" or document.get("is_admin") is True:
        return True
    phone = document.get("phone_number") or ""
    email = (document.get("email") or "").lower()
    return phone in ADMIN_PHONE_NUMBERS or email in ADMIN_EMAILS


def require_admin(current_user: Annotated[dict, Depends(get_current_user)]) -> dict:
    if _is_admin_user(current_user):
        return current_user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")


def _current_user_id(current_user: dict) -> str:
    return str(current_user.get("_id") or current_user.get("id") or "")


def _shop_owner_id(document: dict) -> str:
    owner = document.get("owner_id")
    if owner is not None:
        return str(owner)
    return str(document["_id"])


def _shop_store_id(document: dict) -> str:
    return str(document.get("store_id") or document.get("_id"))


def _shop_is_active(document: dict) -> bool:
    if "shop_active" in document:
        return bool(document.get("shop_active"))
    if "is_active" in document:
        return bool(document.get("is_active"))
    plan = document.get("plan") or {}
    if isinstance(plan, dict) and "is_active" in plan:
        return bool(plan.get("is_active"))
    return True


def _products_count(store_id: str) -> int:
    try:
        return int(_products_collection().count_documents({"store_id": store_id}))
    except Exception:
        return 0


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
        role=(document.get("role") or document.get("user_type")),
        created_at=document.get("created_at"),
        updated_at=document.get("updated_at"),
        plan=build_plan_summary(document),
    )


def serialize_admin_shop(document: dict) -> AdminShop:
    store_id = _shop_store_id(document)
    owner_id = _shop_owner_id(document)
    name = (
        document.get("shop_name")
        or document.get("store_name")
        or document.get("display_name")
        or "Shop"
    )
    return AdminShop(
        id=str(document["_id"]),
        name=name,
        store_id=store_id,
        owner_id=owner_id,
        owner_name=document.get("display_name") or "Owner",
        phone_number=document.get("phone_number"),
        email=document.get("email"),
        products_count=_products_count(store_id),
        is_active=_shop_is_active(document),
        created_at=document.get("created_at"),
        updated_at=document.get("updated_at"),
    )


def _find_shop_document(shop_id: str) -> dict:
    document = users.find_one({"_id": parse_object_id(shop_id, "Shop")})
    if document is None:
        raise HTTPException(status_code=404, detail="Shop not found")
    if _is_admin_user(document) and _user_role(document) == "admin":
        raise HTTPException(status_code=404, detail="Shop not found")
    return document


def _assert_can_deactivate(current_user: dict, shop: dict) -> None:
    """
    Deactivate protocol:
    - Platform admin may deactivate any shop.
    - Shop owner may deactivate their own shop (owner login ID must match shop.owner_id).
    """
    if _is_admin_user(current_user):
        return
    if _current_user_id(current_user) and _current_user_id(current_user) == _shop_owner_id(shop):
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Only an admin or the shop owner can deactivate this shop",
    )


def _set_shop_active(shop_id: str, is_active: bool, current_user: dict) -> AdminShop:
    document = _find_shop_document(shop_id)
    if not is_active:
        _assert_can_deactivate(current_user, document)
    elif not _is_admin_user(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only an admin can activate this shop",
        )

    now = datetime.now(timezone.utc)
    users.update_one(
        {"_id": document["_id"]},
        {
            "$set": {
                "shop_active": is_active,
                "is_active": is_active,
                "updated_at": now,
                "status_changed_by": _current_user_id(current_user),
                "status_changed_at": now,
            }
        },
    )
    refreshed = users.find_one({"_id": document["_id"]})
    if refreshed is None:
        raise HTTPException(status_code=404, detail="Shop not found")
    return serialize_admin_shop(refreshed)


@router.get("/shops", response_model=list[AdminShop])
def list_shops(
    _: Annotated[dict, Depends(require_admin)],
    q: str | None = Query(default=None, max_length=160),
) -> list[AdminShop]:
    """Shops are owner/viewer accounts (non-admin), with product counts by store_id."""
    query: dict[str, Any] = {
        "$and": [
            {
                "$or": [
                    {"is_admin": {"$ne": True}},
                    {"is_admin": {"$exists": False}},
                ]
            },
            {
                "$or": [
                    {"role": {"$exists": False}},
                    {"role": None},
                    {"role": {"$nin": ["admin"]}},
                ]
            },
            {
                "$or": [
                    {"user_type": {"$exists": False}},
                    {"user_type": None},
                    {"user_type": {"$nin": ["admin"]}},
                ]
            },
        ]
    }
    if q and q.strip():
        term = q.strip()
        query["$and"].append(
            {
                "$or": [
                    {"display_name": {"$regex": term, "$options": "i"}},
                    {"shop_name": {"$regex": term, "$options": "i"}},
                    {"store_name": {"$regex": term, "$options": "i"}},
                    {"phone_number": {"$regex": term, "$options": "i"}},
                    {"email": {"$regex": term, "$options": "i"}},
                ]
            }
        )
    documents = users.find(query).sort("created_at", -1).limit(200)
    return [serialize_admin_shop(document) for document in documents]


@router.get("/shops/{shop_id}", response_model=AdminShop)
def get_shop(shop_id: str, _: Annotated[dict, Depends(require_admin)]) -> AdminShop:
    return serialize_admin_shop(_find_shop_document(shop_id))


@router.post("/shops/{shop_id}/status", response_model=AdminShop)
def set_shop_status(
    shop_id: str,
    payload: AdminShopStatusRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
) -> AdminShop:
    """
    Checkbox endpoint. Activate requires admin.
    Deactivate requires admin OR the shop owner (login ID must match owner_id).
    """
    if not _is_admin_user(current_user) and payload.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only an admin can activate this shop",
        )
    if not _is_admin_user(current_user) and not payload.is_active:
        # Owner path — still runs deactivate protocol inside _set_shop_active.
        pass
    elif not _is_admin_user(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return _set_shop_active(shop_id, payload.is_active, current_user)


@router.post("/shops/{shop_id}/activate", response_model=AdminShop)
def activate_shop(
    shop_id: str,
    current_user: Annotated[dict, Depends(require_admin)],
) -> AdminShop:
    return _set_shop_active(shop_id, True, current_user)


@router.post("/shops/{shop_id}/deactivate", response_model=AdminShop)
def deactivate_shop(
    shop_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
) -> AdminShop:
    """Admin or shop owner (matched by login ID / owner_id) may deactivate."""
    return _set_shop_active(shop_id, False, current_user)


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
