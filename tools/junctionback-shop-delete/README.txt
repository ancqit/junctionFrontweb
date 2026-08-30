Cascade shop delete (junctionBack)

When an owner deletes a shop via DELETE /shops/{shop_id}, junctionBack should remove:

- Shop document (profile, plan, location, hours)
- Products for that store_id (including GridFS product images)
- Employees for that store_id
- Orders for that store_id
- Daily notices for that store_id
- Product bucket packs for that store_id
- Shop payment records for that store_id
- Plan/waitlist applications for that shop_id

Apply to junctionBack:

1. Add `app/shop_cleanup.py` (copy from this folder).
2. Apply `shops.patch` to `app/shops.py`.

The owner user account (/profile) is not deleted — only data scoped to the shop.
