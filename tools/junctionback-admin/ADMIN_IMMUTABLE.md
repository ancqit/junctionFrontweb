# junctionBack admin role + shop reactivate

## Rules

1. **Admin role is permanent** — never upgrade or downgrade.
   - Source of truth: `ADMIN_LIST_JSON` / `ADMIN_PHONE` / `ADMIN_EMAIL` / `admin.json`
   - On every login/refresh, registry admins are healed to `role=admin` + `account_status=active`
   - `POST /admin/users/{id}/deactivate` rejects admins
   - `PATCH /admin/users/{id}/role` rejects changing an admin

2. **Shop reactivate** — when a shop owner / viewer is deactivated, an admin signs in
   (still as admin) and reactivates from the shell admin console:
   - Current workings → **Reactivate shop**
   - Viewers tab → **Reactivate**
   - API: `POST /admin/users/{id}/reactivate`

## Backend files changed (ancqit/junctionBack)

- `app/login.py` — `ensure_admin_role`, admin-first `sync_role_from_keeper`
- `app/plan_service.py` — refuse admin deactivate; skip admin in plan downgrade
- `app/admin.py` — refuse admin role changes
- `inan.md` — document immutable admin + reactivate

## Shell (this repo)

- Login/session uses `resolveLoginRole` so admin never becomes viewer
- Admin console: Admin · protected rows; Reactivate shop for deactivated owners
- Viewers tab is the reactivate place for deactivated viewer accounts
