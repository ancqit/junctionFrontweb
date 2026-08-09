junctionBack profile DigiLocker fields — LIVE on main
=====================================================

As of junctionBack commit `fd5f466`, `GET /profile` already returns:

  digilocker_verified: bool
  digilocker_name: str | null

No further backend patch is required for the front-office profile modal.
`profile.py` in this folder is kept as a reference copy only.

APIs used for 100% profile alignment
------------------------------------
  GET  /profile
  PATCH /profile                 { display_name?, bio?, avatar_url? }
  GET  /auth/digilocker/connect  → { authorization_url }
  GET  /auth/digilocker/callback → sets digilocker_* on the user
  GET/POST/PUT /shops            { name, city, locality }

Frontend checklist (equal weight):
  display_name · phone · bio · avatar · digilocker · shop(name/city/locality)
