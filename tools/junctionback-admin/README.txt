Aligned with ancqit/junctionBack PR #10 (shops + role keeper + admin).

Do not invent /admin/shops — use the live contract below.

Auth (OTP verify / refresh / login):
  TokenResponse = { access_token, token_type, user, plan, role }
  user.role and top-level role: admin | owner | viewer

Shops:
  GET    /shops
  GET    /shops/by-name/{shop_name}
  GET    /shops/{shop_id}
  POST   /shops                     { "name" }
  PUT    /shops/{shop_id}           { "name" }
  DELETE /shops/{shop_id}

  Shop = { id, name, phone_number, owner_user_id, created_at, updated_at }
  Access: admin sees all; owner/viewer see shops they own.
  Shop mutations check admin OR caller login ID == owner_user_id.

Admin:
  GET  /admin/users
  POST /admin/users/{user_id}/activate      (no body)
  POST /admin/users/{user_id}/deactivate    (no body — admin only)
  PATCH /admin/users/{user_id}/role         { "role": "owner"|"viewer"|"admin" }
  GET/PUT /admin/role-keeper
  GET/POST /admin/admins[/refresh]

  AdminUserRecord includes account_status, plan_*, role.
  Checkbox on the shell admin page toggles the shop owner's account via activate/deactivate.

Products (for counts):
  GET /products?store_id={shop.id}
  Shell aggregates GET /products and counts by store_id === shop.id.

Shell admin page wires:
  GET /shops + GET /admin/users + GET /products
  → table with product count
  → checkbox → POST /admin/users/{owner_user_id}/activate|deactivate
