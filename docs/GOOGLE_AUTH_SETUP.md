# Google Authentication Setup

The frontend now supports Google Identity Services through `frontend/config.js`. The button becomes a real Google sign-in button after a Google client ID and backend verification endpoint are configured.

## 1. Create a Google Cloud Project

1. Open the Google Cloud Console.
2. Create or select a project for the Cafe Management System.
3. Open **APIs & Services -> OAuth consent screen**.
4. Choose **External** for a normal student project.
5. Add the application name, support email, and developer contact email.
6. Add the scopes `openid`, `email`, and `profile`.
7. Add test users while the app is in testing mode.

Only request the identity scopes needed for login. Do not request Gmail, Drive, or other unrelated permissions.

## 2. Create the Web Client ID

1. Open **APIs & Services -> Credentials**.
2. Choose **Create credentials -> OAuth client ID**.
3. Select **Web application**.
4. Add authorized JavaScript origins:

```text
http://localhost:8000
https://YOUR-PROJECT.vercel.app
```

5. Create the credential and copy the client ID. A client ID is public; a client secret is not.

For the current Python server, use `http://localhost:8000`. Do not use a `file:///` URL for the real OAuth test.

## 3. Configure the Frontend

Edit `frontend/config.js`:

```js
window.GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';
window.GOOGLE_AUTH_API = '/api/auth/google';
```

The client ID may be visible in browser code. Never put a Google client secret, MongoDB URI, or private key in this file.

## 4. Prepare the Backend

From the future backend directory:

```powershell
cd backend
npm init -y
npm install express mongoose google-auth-library bcrypt helmet cors express-rate-limit cookie-parser dotenv
npm install --save-dev nodemon
```

The backend endpoint should receive the Google credential and verify it before creating a local user session. The browser must never decide the user's role.

A simplified verification flow is:

```js
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleCredential(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw new Error('Google account is not verified.');
  }
  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split('@')[0],
    avatarUrl: payload.picture || null
  };
}
```

The `POST /api/auth/google` route should:

1. Validate that a credential exists.
2. Verify it with Google's library and the expected client ID.
3. Find or create the user in MongoDB using the verified Google subject ID.
4. Assign a server-controlled role, such as `waiter`; never accept a role from the browser.
5. Create a secure HTTP-only session cookie.
6. Return only safe profile data and a success status.

## 5. Store Users in MongoDB

Recommended `users` document:

```json
{
  "googleId": "verified-google-subject-id",
  "email": "waiter@cafe.com",
  "name": "Maria Shah",
  "avatarUrl": null,
  "role": "waiter",
  "status": "active",
  "lastLoginAt": "2026-09-30T00:00:00.000Z",
  "createdAt": "2026-09-30T00:00:00.000Z",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
```

Create a unique index for `googleId` and `email`. Google authentication does not require storing a password for Google-only accounts. Keep password login as a separate flow with bcrypt or Argon2 hashes.

## 6. Environment Variables

Local backend `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cafe_management
GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com
SESSION_SECRET=generate-a-long-random-value
FRONTEND_ORIGIN=http://localhost:8000
```

Add the same variable names to Vercel Project Settings, but use a MongoDB Atlas connection string for `MONGODB_URI`. Never commit `.env` to GitHub.

## 7. Test Locally

Start MongoDB, then start the backend on port 5000. In another terminal, serve the repository root:

```powershell
python -m http.server 8000
```

Open:

```text
http://localhost:8000/frontend/login.html
```

Test that:

- Google opens the account chooser.
- A verified account creates one MongoDB user.
- Repeated login does not create duplicate users.
- The backend, not the frontend, assigns the role.
- Closing the browser session removes access according to the cookie policy.
- Logout clears the server session.

## 8. Deploy

1. Deploy the backend API and set its environment variables.
2. Configure the Vercel frontend's `GOOGLE_AUTH_API` to the deployed API URL if it is not same-origin.
3. Add the exact Vercel domain to Google's authorized JavaScript origins.
4. Update CORS on the backend to allow only the Vercel frontend origin.
5. Use HTTPS and secure, HTTP-only, SameSite cookies in production.

Google login is not fully live until the backend endpoint and Google Cloud client ID are configured. The current frontend intentionally shows a setup message until those values exist.
