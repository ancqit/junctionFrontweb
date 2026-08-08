# Junction Back Web

Angular Nx Native Federation workspace with:

- `shell` on `http://localhost:4200` — the Native Federation host that owns OTP login, authentication, API configuration, route protection, and token refresh.
- `back-office` on `http://localhost:4201` — the Native Federation remote loaded by the shell after login.
- Local API base URL: `http://localhost:8000` in `apps/shell/src/app/core/api.config.ts`.

## Run locally

Start the host and remote together with Nx:

```powershell
npm start
```

Then open `http://localhost:4200`. See [local.md](./local.md) for Nx Console, `run-many`, separate-server, build, and additional-remote workflows. The development location is locked to **Ranchi / Main Road**.

## OTP API contract

The frontend expects the local backend to provide these routes:

### `POST /auth/otp/request`

Request:

```json
{ "name": "Aarav Kumar", "mobileNumber": "9876543210", "city": "Ranchi", "locality": "Main Road" }
```

Response:

```json
{ "challengeId": "otp-challenge-id", "expiresInSeconds": 300 }
```

### `POST /auth/otp/verify`

Request: `{ "challengeId": "otp-challenge-id", "otp": "123456" }`

Response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresInSeconds": 3600,
  "user": { "id": "...", "name": "Aarav Kumar", "mobileNumber": "9876543210", "city": "Ranchi", "locality": "Main Road" }
}
```

### `POST /auth/refresh`

Request: `{ "refreshToken": "..." }`

Response: `{ "accessToken": "...", "refreshToken": "...", "expiresInSeconds": 3600 }`

The shell refreshes five minutes before expiry. The HTTP interceptor adds `Authorization: Bearer <token>` to local API requests and retries one failed request after a successful refresh.

> The adjacent `junction-back` project currently implements email/password JWT routes, not these OTP routes. Its authentication API must be updated to this contract before the OTP login can complete end to end.

## Build

```powershell
npm run build
```
