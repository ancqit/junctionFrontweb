Aligned with ancqit/junctionBack (shops + role keeper + admin activate/reactivate).

Do not invent /admin/shops — use the live contract below.

Auth (OTP verify / refresh / login):
  TokenResponse = { access_token, token_type, user, plan, role }
  user.role and top-level role: admin | owner | viewer
  Deactivated accounts can still log in; backend downgrades them to viewer
  (junctionBack #20 — no more 403 on deactivated login).

Shops:
  GET    /shops
  GET    /shops/by-name/{shop_name}
  GET    /shops/{shop_id}
  POST   /shops                     { "name", "city", "locality" }
  PUT    /shops/{shop_id}           { "name", "city", "locality" }
  DELETE /shops/{shop_id}

  Shop = { id, name, phone_number, owner_user_id, city, locality, created_at, updated_at }
  Access: admin sees all; owner/viewer see shops they own.
  Shop mutations check admin OR caller login ID == owner_user_id.

Admin:
  GET  /admin/users
  GET  /admin/viewers
  POST /admin/users/{user_id}/activate      (no body; routes deactivated → reactivate)
  POST /admin/users/{user_id}/reactivate    (no body; restores role + plan + activities)
  POST /admin/users/{user_id}/deactivate    (no body — sets viewer, stores pre_deactivation_role)
  DELETE /admin/viewers                     { "user_ids": ["..."] }  (viewers only)
  PATCH /admin/users/{user_id}/role         { "role": "owner"|"viewer"|"admin" }
  GET/PUT /admin/role-keeper
  GET/POST /admin/admins[/refresh]

  ReactivateUserResponse = {
    user: AdminUserRecord,
    restored_role,
    restored_plan,
    restored_activities: ["manage_shops", "create_products", ...]
  }

  Shell admin:
  - Current workings checkbox Off → deactivate
  - Checkbox On when account_status=deactivated → reactivate (show restored activities)
  - Checkbox On otherwise → activate
  - Viewers tab: list + Reactivate/Activate + Deactivate + Delete

Products (for counts):
  GET /products?store_id={shop.id}
  Shell aggregates GET /products and counts by store_id === shop.id.
