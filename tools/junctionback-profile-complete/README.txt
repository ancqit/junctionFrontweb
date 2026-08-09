Extend junctionBack `app/profile.py` so GET /profile can report DigiLocker status
(used by the front-office profile completeness modal).

In class Profile, add:

    digilocker_verified: bool = False
    digilocker_name: str | None = None

In serialize_profile(...):

    digilocker_verified=bool(user.get("digilocker_verified")),
    digilocker_name=user.get("digilocker_name"),

DigiLocker APIs already on main:
  GET /auth/digilocker/connect   → { authorization_url }
  GET /auth/digilocker/callback  → sets digilocker_verified on the user

Profile APIs:
  GET  /profile
  PATCH /profile  { display_name?, bio?, avatar_url? }

100% profile (front) = name + phone + bio + avatar + DigiLocker + shop(name/city/locality).
