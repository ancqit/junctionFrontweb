# Junction native builds (Android APK + Windows desktop)

This guide documents how we package the Junction front-end (shell + back-office module federation) as:

- **Android APK** — Capacitor branch `feature/capacitor-mobile`
- **Windows installer** — Electron branch `feature/electron-desktop`

Both use the same web bundle (`dist/app-bundle`) built by `tools/prepare-app-bundle.mjs`.

Repository: [junctionFrontweb](https://github.com/ancqit/junctionFrontweb)

| Branch | Purpose |
|--------|---------|
| `feature/capacitor-mobile` | Android APK / iOS |
| `feature/electron-desktop` | Windows / macOS desktop |

Production API: `https://junctionback.onrender.com` (Render). Web on Vercel uses `/api` rewrite; native apps call Render directly.

---

## Prerequisites

### All platforms

- **Node.js** 20+ and **npm** 11+
- Clone the correct branch:

```powershell
# Mobile (Capacitor)
git clone -b feature/capacitor-mobile https://github.com/ancqit/junctionFrontweb.git mobile
cd mobile
npm install

# Desktop (Electron)
git clone -b feature/electron-desktop https://github.com/ancqit/junctionFrontweb.git desktop
cd desktop
npm install
```

### Android APK only

| Tool | Notes |
|------|--------|
| **JDK 21** | Microsoft OpenJDK 21 (`winget install Microsoft.OpenJDK.21`) |
| **Android SDK** | Android Studio or [command-line tools](https://developer.android.com/studio#command-tools) |
| **ANDROID_HOME** | e.g. `C:\Users\<you>\Android\Sdk` |
| **local.properties** | In `android/local.properties`: `sdk.dir=C:\\Users\\<you>\\Android\\Sdk` (local only, do not commit) |

Install SDK packages (after accepting licenses):

```powershell
$sdk = "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat"
& $sdk --sdk_root=$env:ANDROID_HOME "platform-tools" "platforms;android-35" "build-tools;35.0.0"
```

### Windows desktop only

No extra SDK beyond Node. Electron Builder downloads its own tooling on first pack.

---

## Branding (logo / favicon / app icon)

Source logo: `branding/logo.svg` (Junction gold `#f3d782` + green `#194b31`).

Generate raster icons and sync favicons:

```powershell
npm run branding:icons
```

This creates:

- `branding/icon.png` (1024²) — Electron / store listings
- `branding/favicon-32.png`, `branding/favicon.ico`
- `apps/shell/public/favicon.svg` and `apps/back-office/public/favicon.svg`
- On mobile: Android `mipmap-*` launcher icons from the logo

Re-run after changing `branding/logo.svg`, then rebuild the app bundle and native project.

---

## Build the shared web bundle

Both Capacitor and Electron load `dist/app-bundle`:

```powershell
npm run build:app-bundle
```

What it does:

1. `nx build` for `shell` and `back-office`
2. Copies outputs into `dist/app-bundle/` with relative federation manifest
3. Sets `<base href="./">` for `file://` / Capacitor / Electron

---

## Android APK (debug)

### One-shot

```powershell
cd mobile
npm run branding:icons
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.8-hotspot"
$env:ANDROID_HOME = "C:\Users\<you>\Android\Sdk"
npm run release:android
```

### Step by step

```powershell
npm run branding:icons
npm run build:app-bundle
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

**APK output:**

`android/app/build/outputs/apk/debug/app-debug.apk`

**Release folder** (after `npm run release:android`):

`releases/`

- `junction-mobile-debug.apk`
- `logo.svg`, `icon.png`, `favicon-32.png`, `favicon.ico`
- `NATIVE-BUILDS.md` (this file)

### Install on a device

- Copy `junction-mobile-debug.apk` to the phone and open it, or
- `adb install releases/junction-mobile-debug.apk` with USB debugging enabled

### OTP / API note

The APK uses `https://junctionback.onrender.com` for API calls (not `localhost:8000` or `/api`). **CapacitorHttp** is enabled so native HTTP bypasses browser CORS (origin `https://localhost` is not allowed by the Render API). OTP login uses reCAPTCHA in the WebView; ensure the device has internet access.

### Release APK (signed)

Configure signing in `android/app/build.gradle`, then:

```powershell
npm run cap:build:android:release
```

---

## Windows desktop installer

```powershell
cd desktop
npm run branding:icons
npm run release:win
```

Or step by step:

```powershell
npm run branding:icons
npm run build:app-bundle
npm run electron:pack:win
node tools/prepare-release.mjs
```

**Installer output:**

`dist/electron/Junction Setup *.exe`

**Release folder:**

`releases/` — installer `.exe`, branding assets, and this doc.

### Dev mode (live Angular)

```powershell
npm run start:shell
npm run electron:dev
```

Loads `http://localhost:4200` with API at `http://localhost:8000`.

### macOS

```powershell
npm run electron:pack:mac
```

Produces a `.dmg` in `dist/electron/`.

---

## Local folder layout (this workspace)

| Path | Branch |
|------|--------|
| `junction file\mobile` | `feature/capacitor-mobile` |
| `junction file\desktop` | `feature/electron-desktop` |
| `junction file\releases` (mobile) | APK + logo bundle |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Gradle download timeout | Increase `networkTimeout` in `android/gradle/wrapper/gradle-wrapper.properties` or download Gradle manually |
| `SDK location not found` | Create `android/local.properties` with `sdk.dir` |
| `invalid source release: 21` | Use JDK 21 for Android build |
| OTP fails in APK | Confirm CapacitorHttp is enabled in `capacitor.config.ts`; device has network; reCAPTCHA may need Google connectivity |
| Terms show fallback text in APK | API blocked by CORS — enable `CapacitorHttp` in `capacitor.config.ts` |
| Electron OTP fails | Production bundle uses Render API; dev mode needs local backend on port 8000 |

---

## Push changes to GitHub

```powershell
git add shared/ apps/ branding/ tools/ docs/ android/
git commit -m "Fix native API URL, branding icons, and release docs"
git push origin feature/capacitor-mobile   # or feature/electron-desktop
```

Do **not** commit `android/local.properties` or `.nx/cache`.
