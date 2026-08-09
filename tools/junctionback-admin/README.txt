Apply to ancqit/junctionBack:

1. Copy admin.py -> app/admin.py
2. In app/main.py:
   from .admin import router as admin_router
   app.include_router(admin_router)
3. Login / refresh UserSummary must include role (or user_type):
     "admin"  -> shell /admin (activate / reactivate users)
     "owner"  -> shell /back-office (shop workspace)
     "viewer" -> shell /viewer (shop-owner explanatory page)
4. Optional env (in addition to role=admin):
   ADMIN_PHONE_NUMBERS=+9198xxxxxxxx,+9199xxxxxxxx
   ADMIN_EMAILS=you@example.com
   Or set is_admin: true / role: "admin" on a user document in MongoDB.

Endpoints:
  GET  /admin/users?q=
  GET  /admin/users/{user_id}
  POST /admin/users/{user_id}/plan      body: { "plan_type": "starter"|"growth"|"premium" }
  POST /admin/users/{user_id}/activate  body: { "plan_type": "starter"|"growth"|"premium" }
