
# ALLINONE AI — Developer & Deployment Guide

## 1. Project Structure
- `index.html`: Entry point & External SDKs (Google GSI).
- `index.tsx`: React mounting logic.
- `App.tsx`: Core state management (Auth, Navigation).
- `geminiService.ts`: AI logic using `@google/genai`.
- `views/`: Functional screens (Chat, MediaLab, CodingLab, etc.).
- `components/`: Reusable UI elements (Navigation, TopBar, Ads).

## 2. Play Store Setup
### Fix "Error 401: invalid_client" (Login.tsx)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create/Select a Project.
3. Search for "APIs & Services" > **OAuth Consent Screen** (Configure this first).
4. Go to **Credentials** > **Create Credentials** > **OAuth Client ID**.
5. Select **Web application** (Important: Even for mobile wrappers like Capacitor, a Web ID is used for the GSI library).
6. Add your domain (e.g., `http://localhost`, `https://your-app.com`) to **Authorized JavaScript origins**.
7. Copy the **Client ID** (looks like `xxx-yyy.apps.googleusercontent.com`).
8. In `views/Login.tsx`, replace `GOOGLE_CLIENT_ID` value with your real ID.

### Google Play Billing (Premium.tsx)
1. In Play Console, create **In-App Products**.
2. IDs: `premium_monthly`, `premium_quarterly`.
3. The current code simulates the billing flow. For production, integrate `@capacitor/billing`.

## 3. Build Instructions
### Prerequisites
- Node.js installed.
- Modern browser for local testing.
- Capactior or Cordova (for APK).

### Local Setup
1. `npm install`
2. `npm run start`
3. If Google Login shows "invalid_client", see section 2 above. Use "Dev Mode Login" for local testing.

### Android APK Build
1. Build web files: `npm run build`.
2. `npx cap add android` then `npx cap copy`.
3. Open in Android Studio: `npx cap open android`.
4. Generate Signed APK.
