Aligned with ancqit/junctionBack #21 (owner/viewer + waitlist-only activation).

Admin console (shell `/admin`) — two tabs only:

1. Shops — `GET /shops` (+ product counts). Admins do **not** create shops.
2. Waitlist — `GET /admin/waitlist` (pending viewer plan applications).
   Approve — `POST /admin/users/{user_id}/activate` (viewer → owner + requested plan).

Owners choose plans themselves via `POST /plans/select` (not admin approval).

Auth:
  TokenResponse = { access_token, token_type, user, plan, role }
  role: admin | owner | viewer

Shops:
  GET /shops — admin sees all
  Owners create shops in back office (POST /shops) — not from admin console

Waitlist:
  GET  /admin/waitlist              list PlanApplication rows
  POST /admin/users/{id}/activate   approve pending waitlist for that user_id

PlanApplication = {
  id, user_id, shop_id, shop_name,
  identity: { display_name, phone_number, email },
  location: { city, locality },
  requested_plan_type, current_plan_type,
  is_plan_switch, switch_message, status, created_at, updated_at
}
