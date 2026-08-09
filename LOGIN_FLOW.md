# Login flow summary

What happens when someone signs in to Junction (shell + junctionBack).

## 1. Sign-in

1. User opens `/login` and enters **name** + **mobile** (+91).
2. Shell sends `POST /auth/otp/request` (with reCAPTCHA).
3. User enters the OTP.
4. Shell sends `POST /auth/otp/verify`.
5. Backend returns a **TokenResponse** with `user`, `plan`, and `role` (`admin` | `owner` | `viewer`).
6. Shell stores the access token and session (`user` + `role`).
7. Routing uses **role** and plan status.

If `account_status` is `deactivated` by an admin, login is rejected by the backend.

---

## 2. Roles — where each user goes

| Role | Who | After OTP | Can open |
|------|-----|-----------|----------|
| **admin** | Platform admin | `/admin` | Admin console **and** full app |
| **owner** | Active shop owner (trial / paid / still in grace) | Plan step → `/back-office` | Full shop back office |
| **viewer** | Post–plan + grace deactivated account (**not** an owner) | `/back-office/activate` | Deactivated view + Plans only |

Guards: `authGuard`, `authorGuard(...)`, and back-office `planActiveGuard`.

---

## 3. What happens per role

### Admin

1. Login ID shown in the admin sidebar.
2. Lands on **`/admin`** (shops + product counts).
3. Checkbox activates / deactivates shop **owners** via `/admin/users/{id}/activate|deactivate`.
4. Can also open the full back office.

### Owner

1. After OTP, sees the **plans** step when appropriate.
2. Full **`/back-office`** (overview, products, employees, orders, billing, plans).
3. While **grace period** is still running after Premium/trial ends, they remain an **owner** (not a viewer yet).

### Viewer (deactivated view)

After **Premium (or trial) ends** and the **grace period ends**, the account is a **viewer** — you are **not** an owner anymore.

1. Login still works.
2. You land on **`/back-office/activate`** — the **deactivated view** in the app.
3. That page explains the locked state and lists what is off (overview, employees, products, orders, billing).
4. Nav is limited to **Deactivated** + **Plans**.
5. Choosing Starter / Growth / Premium on Plans unlocks the app and restores **owner** access.

Shell `/viewer` redirects to the same Activate page.

---

## 4. Session after login

```text
OTP verify
   → save token + user.id + role
   → if viewer OR plan post-grace → /back-office/activate
   → if admin → /admin
   → if owner → plans step → /back-office
```

---

## 5. Backend dependency

Roles, grace, and shops/admin APIs come from **junctionBack** (shops + role keeper PR).
See `tools/junctionback-admin/README.txt` for the API contract the shell expects.
