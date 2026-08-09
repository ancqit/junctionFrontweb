# Login flow summary

What happens when someone signs in to Junction (shell + junctionBack).

## 1. Sign-in

1. User opens `/login` and enters **name** + **mobile** (+91).
2. Shell sends `POST /auth/otp/request` (with reCAPTCHA).
3. User enters the OTP.
4. Shell sends `POST /auth/otp/verify`.
5. Backend returns a **TokenResponse**:

```json
{
  "access_token": "…",
  "token_type": "bearer",
  "user": {
    "id": "<login id>",
    "display_name": "…",
    "phone_number": "+91…",
    "email": null,
    "role": "admin | owner | viewer"
  },
  "plan": { "…": "plan summary" },
  "role": "admin | owner | viewer"
}
```

6. Shell stores the access token and session (`user` + `role`).
7. Routing uses **role** (top-level `role` or `user.role`).

If `account_status` is `deactivated`, login is rejected by the backend.

---

## 2. Roles — where each user goes

| Role | Who | After OTP | Can open |
|------|-----|-----------|----------|
| **admin** | Platform admin (admin registry / `ADMIN_PHONE` / `ADMIN_EMAIL`) | `/admin` | Admin console **and** full app (`/back-office`) |
| **owner** | Shop owner | Plan step → `/back-office` | Full shop back office |
| **viewer** | Shop-owner style login (non-admin) | `/viewer` | Explanatory viewer page only |

Guards:

- `authGuard` — must be logged in
- `authorGuard('admin' | 'owner' | 'viewer' | …)` — must match role

---

## 3. What happens per role

### Admin

1. Login ID is kept in session and shown in the admin sidebar.
2. Lands on **`/admin`** (shops console).
3. Also allowed into **`/back-office`** (full application).
4. Admin page loads:
   - `GET /shops` — all shops
   - `GET /admin/users` — owner account / plan status
   - `GET /products` — product counts by `store_id === shop.id`
5. **Checkbox** on a shop:
   - On → `POST /admin/users/{owner_user_id}/activate`
   - Off → `POST /admin/users/{owner_user_id}/deactivate`
6. Deactivated owners cannot log in until an admin activates them again.

### Owner

1. After OTP, sees the **plans** step (free trial / Starter / Growth / Premium).
2. Continues into **`/back-office`** (products, employees, orders, billing, plans, etc.).
3. Can manage **their** shops via `GET/POST /shops` (owner login ID must match `owner_user_id`).
4. Product limits follow their plan (`require_active_plan` on the backend).

### Viewer

1. After OTP, goes to **`/viewer`**.
2. Sees a short page explaining they are a shop-owner style user, **not** platform admin.
3. Does **not** get the admin console or the full back-office routes (guarded).

---

## 4. Session after login

```text
OTP verify
   → save token + user.id + role
   → schedule /auth/refresh
   → navigate by role
```

- Refresh keeps the session alive and re-syncs `user` / `role`.
- Logout clears token + session and returns to `/login`.

---

## 5. Backend dependency

Shops + admin activate/deactivate + role on login come from **junctionBack** (PR #10: shops API + MongoDB role keeper).

Until that is deployed:

- Role routing in the shell is ready
- `/shops` and `/admin/users/*` may 404 on production

See `tools/junctionback-admin/README.txt` for the API contract the shell expects.
