Apply to ancqit/junctionBack:

1. Copy admin.py -> app/admin.py
2. In app/main.py:
   from .admin import router as admin_router
   app.include_router(admin_router)
3. Optional env:
   ADMIN_PHONE_NUMBERS=+9198xxxxxxxx,+9199xxxxxxxx
   ADMIN_EMAILS=you@example.com
   Or set is_admin: true on a user document in MongoDB.

Endpoints:
  GET  /admin/users?q=
  GET  /admin/users/{user_id}
  POST /admin/users/{user_id}/plan      body: { "plan_type": "starter"|"growth"|"premium" }
  POST /admin/users/{user_id}/activate  body: { "plan_type": "starter"|"growth"|"premium" }
