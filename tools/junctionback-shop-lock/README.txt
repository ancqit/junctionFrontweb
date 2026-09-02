junctionBack — per-shop owner/viewer lock
==========================================

Adds `is_locked` + `lock_reason` on Shop and `PUT /shops/lock-status` (same pattern as
`open-status` / `phone-status`).

Apply on junctionBack (ancqit/junctionBack):

1. Copy fields + endpoint from `shops_lock.patch` into `app/shops.py` (and Shop model).
2. Deploy API; until then the back office keeps lock state in localStorage overlay.

Fields
------
- `is_locked: bool` — when true, back-office treats the shop as viewer mode.
- `lock_reason: "manual" | "plan_expired" | null` — why it was locked.

Endpoint
--------
`PUT /shops/lock-status` body: `{ "name": "<shop name>", "is_locked": true, "lock_reason": "manual" }`

The frontend also falls back to `PUT /shops/{id}` with `{ is_locked: ... }` on 404/422.
