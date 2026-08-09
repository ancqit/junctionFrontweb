Aligned with junctionBack main (PR #11). Frontend uses these live endpoints:

  POST /plans/apply   { "plan_type": "starter"|"growth"|"premium", "shop_id": "..." }
  GET  /plans/applications/me
  GET  /plans/apply/preview?plan_type=premium

  Aliases: POST /waitlist, GET /waitlist/me, GET /waitlist/preview

  GET  /locations/cities              → { "cities": string[] }
  GET  /locations/localities?city=…   → { "city", "localities": string[] }

  POST /shops                         { "name", "city", "locality" }  (all required)
  PUT  /shops/{id}

Plan click UX:
  1. Shop must already have name + city + locality (Overview).
  2. POST /plans/apply with plan_type + shop_id.
  3. Backend snapshots shop_name and location { city, locality } onto the waitlist entry.
  4. Plans page shows pending waitlist / application-forwarded view.

The Python stubs in this folder are obsolete drafts — prefer junctionBack app/plan_applications.py.
