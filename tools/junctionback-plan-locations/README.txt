Apply to ancqit/junctionBack (this bot cannot push that repo).

1. database.py — add collections:
     plan_applications = database["plan_applications"]
     cities = database["cities"]
     localities = database["localities"]

2. Copy plan_applications.py and locations.py into app/

3. main.py:
     from .plan_applications import router as plan_applications_router
     from .locations import router as locations_router
     app.include_router(plan_applications_router)
     app.include_router(locations_router)

4. Extend shops with optional city + locality (see shops_city_locality.txt)

Endpoints used by junctionFrontweb:

  POST /plans/applications          { "plan_type": "starter"|"growth"|"premium" }
  GET  /plans/applications/me

  GET  /locations/cities
  GET  /locations/localities?city=Ranchi

  GET/POST /shops
  PUT /shops/{id}                   { "name", "city?", "locality?" }

Plan select UX:
  Choosing a plan adds the user to the application list and returns status "forwarded".
  The Plans page then shows the forwarded application view (not immediate unlock).
