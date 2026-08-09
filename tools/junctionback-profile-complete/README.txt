junctionBack profile DigiLocker fields
======================================

This cloud agent cannot push to ancqit/junctionBack (GitHub 403).
Apply this change on junctionBack, then redeploy Render.

What to do
----------
1. Copy `profile.py` from this folder over `app/profile.py` on junctionBack
   (or cherry-pick the local commit on `/tmp/junctionBack` branch
   `cursor/profile-digilocker-fields-8fc2` if you have that clone).

2. Redeploy junctionBack so `GET /profile` returns:

     digilocker_verified: bool
     digilocker_name: str | null

Fields added
------------
- `digilocker_verified` — true after `GET /auth/digilocker/callback` succeeds
- `digilocker_name` — name returned by DigiLocker userinfo

Existing DigiLocker APIs (already on main)
------------------------------------------
  GET /auth/digilocker/connect   → { authorization_url }
  GET /auth/digilocker/callback  → sets digilocker_* on the user document

Profile APIs
------------
  GET  /profile
  PATCH /profile  { display_name?, bio?, avatar_url? }

Front-office 100% checklist uses name + phone + bio + avatar + DigiLocker + shop.
