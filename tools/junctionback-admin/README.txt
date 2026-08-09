Apply to ancqit/junctionBack:

1. Copy admin.py -> app/admin.py
2. In app/main.py:
   from .admin import router as admin_router
   app.include_router(admin_router)
3. Login / refresh UserSummary must include role (or user_type):
     "admin"  -> shell /admin (shops + full app access via login ID)
     "owner"  -> shell /back-office (shop workspace)
     "viewer" -> shell /viewer (shop-owner explanatory page)
4. Optional env (in addition to role=admin):
   ADMIN_PHONE_NUMBERS=+9198xxxxxxxx,+9199xxxxxxxx
   ADMIN_EMAILS=you@example.com
   Or set is_admin: true / role: "admin" on a user document in MongoDB.

Shops:
  Non-admin users (owner/viewer) are listed as shops.
  Product count = products.count_documents({ store_id })
  store_id defaults to the user id when missing.
  shop_active / is_active flags drive the activate checkbox.

Deactivate protocol:
  - Admin may activate or deactivate any shop.
  - Deactivate is also allowed when the caller's login ID matches shop.owner_id
    (the shop owner deactivating their own shop).
  - Activate requires admin.

Endpoints:
  GET  /admin/shops?q=
  GET  /admin/shops/{shop_id}
  POST /admin/shops/{shop_id}/status      body: { "is_active": true|false }
  POST /admin/shops/{shop_id}/activate
  POST /admin/shops/{shop_id}/deactivate

  GET  /admin/users?q=
  GET  /admin/users/{user_id}
  POST /admin/users/{user_id}/plan      body: { "plan_type": "starter"|"growth"|"premium" }
  POST /admin/users/{user_id}/activate  body: { "plan_type": "starter"|"growth"|"premium" }
