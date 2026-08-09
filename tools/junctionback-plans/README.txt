Apply to ancqit/junctionBack:

1. Copy plans.py into app/plans.py
2. In app/main.py:
   - add: from .plans import router as plans_router
   - add: app.include_router(plans_router)

Endpoints:
  GET  /plans
  GET  /plans/me
  POST /plans/trial/start   # starts 15-day counter
  POST /plans/select        # body: { "plan_id": "starter"|"growth"|"premium" }

Trial auto-expires when /plans/me is read after trial_ends_at.
