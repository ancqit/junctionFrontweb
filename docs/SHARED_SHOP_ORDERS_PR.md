# Agent brief: PR for `feature/shared-shop-orders`

Use this file to open a pull request for the **Junction Front Web** owner Orders inbox that shows customer orders from junction.today.

## Repo facts

| Field | Value |
| --- | --- |
| GitHub | `ancqit/junctionFrontweb` |
| Local folder | `junction-frontweb` |
| Branch | `feature/shared-shop-orders` |
| Base | `main` |
| Remote | `origin` (`https://github.com/ancqit/junctionFrontweb.git`) |
| Companion PRs required first | **junctionBack** `feature/shared-shop-orders` (session create + owner `PATCH /orders/{id}`) must be merged and deployed to Render |

## What this branch does

- Orders page lists shop-scoped orders via `GET /orders?store_id=...` (owner JWT).
- Owner can **Confirm / Complete / Cancel** via `PATCH /orders/{id}` `{ "status": "..." }`.
- Page polls about every **20 seconds** while open so new Today checkouts show up without a full reload.
- Shows order `source` (e.g. `junction.today`) when present.

### Files changed

- `apps/back-office/src/app/core/orders.api.ts` — `updateStatus` → `PATCH`
- `apps/back-office/src/app/core/models.ts` — optional `source` on Order
- `apps/back-office/src/app/features/orders/orders.ts`
- `apps/back-office/src/app/features/orders/orders.html`
- `apps/back-office/src/app/features/orders/orders.scss`

## Deploy order

1. Merge + deploy **junctionBack** shared-orders branch.
2. Merge **jtoday** shared-orders PR (customer checkout).
3. Merge this PR (Front Web inbox).

## Create the PR (copy-paste)

From this repo root on `feature/shared-shop-orders`:

```powershell
git push -u origin HEAD

gh pr create --base main --head feature/shared-shop-orders --title "Shared shop orders: owner inbox Confirm/Complete/Cancel" --body "$( @'
## Summary
- Shop owners see customer orders from junction.today in the existing Orders page (same Mongo `orders` / `store_id`).
- Add Confirm / Complete / Cancel actions via `PATCH /orders/{id}`.
- Poll orders ~every 20s while the page is open so new Today checkouts appear.
- Display optional `source` (e.g. junction.today).

## Depends on
- [ ] junctionBack PR for `feature/shared-shop-orders` merged and live on Render (`PATCH /orders/{id}` + session `POST /orders`).

## Companion
- jtoday `feature/shared-shop-orders` — checkout posts with session JWT and `source: junction.today`.

## Test plan
- [ ] Backend shared-orders deployed.
- [ ] Place a COD order on junction.today for a Front Web shop; note `order_number`.
- [ ] Open Front Web → back-office → Orders for that shop → same order appears (pending).
- [ ] Confirm → Complete (and Cancel on another test order) update status without reload.
- [ ] Leave Orders open ~20s after another Today checkout → new row appears via poll.
- [ ] Filter by status / customer name still works.

## Notes for reviewers
- Owner JWT only; session tokens cannot list or patch orders.
- Route remains `/back-office/orders`.
'@ )"
```

## Suggested PR title

`Shared shop orders: owner inbox Confirm/Complete/Cancel`

## Do not

- Do not force-push `main`.
- Do not merge before junctionBack exposes `PATCH /orders/{id}` for owners.
- Do not remove the poll interval without replacing it with another refresh path.
