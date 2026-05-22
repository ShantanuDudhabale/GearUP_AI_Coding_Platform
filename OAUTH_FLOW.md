# OAuth Authentication Flow

## Before Fix (404 Error)

```
User clicks "Google Login"
    ↓
LoginModal.tsx (hardcoded URL)
    ↓
http://localhost:5000/api/auth/google
    ↓
❌ 404 NOT FOUND
    ↓
User sees error page
```

---

## After Fix (Working)

```
User clicks "Google Login"
    ↓
LoginModal.tsx (dynamic URL from env)
    ↓
process.env.NEXT_PUBLIC_API_URL
    ↓
http://localhost:5000/api/auth/google
    ↓
✅ Backend receives request
    ↓
Passport.js Google Strategy
    ↓
Redirect to Google OAuth
    ↓
User authenticates with Google
    ↓
Google redirects back with code
    ↓
http://localhost:5000/api/auth/google/callback?code=...
    ↓
Backend validates code & creates user
    ↓
Redirect to frontend with token
    ↓
http://localhost:3000/oauth-success?token=...
    ↓
Frontend fetches user profile
    ↓
http://localhost:5000/api/auth/me
    ↓
User logged in & redirected to /chat
    ↓
✅ SUCCESS
```

---

## Error Handling Flow

```
User clicks "Google Login"
    ↓
OAuth process starts
    ↓
User clicks "Cancel" or error occurs
    ↓
Backend catches error
    ↓
Redirect to error page
    ↓
http://localhost:3000/oauth-failure?message=...
    ↓
User sees friendly error message
    ↓
User can try again
```

---

## Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌──────────────┐              │
│  │ LoginModal   │────────▶│ OAuth Button │              │
│  │              │         │ Click Handler│              │
│  └──────────────┘         └──────┬───────┘              │
│                                   │                       │
│                                   │ window.location.href  │
│                                   ▼                       │
└───────────────────────────────────┼───────────────────────┘
                                    │
                                    │ HTTP Redirect
                                    │
┌───────────────────────────────────▼───────────────────────┐
│                   Backend (Express.js)                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐         ┌──────────────┐               │
│  │ authRoutes   │────────▶│ Passport.js  │               │
│  │ /auth/google │         │ Strategy     │               │
│  └──────────────┘         └──────┬───────┘               │
│                                   │                        │
│                                   │ Authenticate           │
│                                   ▼                        │
└───────────────────────────────────┼────────────────────────┘
                                    │
                                    │ Redirect to Provider
                                    │
┌───────────────────────────────────▼────────────────────────┐
│                  OAuth Provider (Google/GitHub)            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  User authenticates                                        │
│  Provider generates code                                   │
│  Redirects back to callback URL                            │
│                                                            │
└───────────────────────────────────┬────────────────────────┘
                                    │
                                    │ Callback with code
                                    │
┌───────────────────────────────────▼────────────────────────┐
│                   Backend (Express.js)                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐         ┌──────────────┐               │
│  │ /callback    │────────▶│ Validate Code│               │
│  │              │         │ Create User  │               │
│  └──────────────┘         └──────┬───────┘               │
│                                   │                        │
│                                   │ Generate JWT           │
│                                   ▼                        │
└───────────────────────────────────┼────────────────────────┘
                                    │
                                    │ Redirect with token
                                    │
┌───────────────────────────────────▼────────────────────────┐
│                    Frontend (Next.js)                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐         ┌──────────────┐               │
│  │ /oauth-      │────────▶│ Fetch User   │               │
│  │ success      │         │ Profile      │               │
│  └──────────────┘         └──────┬───────┘               │
│                                   │                        │
│                                   │ Store in Zustand       │
│                                   ▼                        │
│                          ┌──────────────┐                 │
│                          │ Redirect to  │                 │
│                          │ /chat        │                 │
│                          └──────────────┘                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## URL Endpoints

### Frontend URLs
```
http://localhost:3000/                    ← Landing page
http://localhost:3000/login               ← Login page
http://localhost:3000/oauth-success       ← OAuth success handler
http://localhost:3000/oauth-failure       ← OAuth error handler
http://localhost:3000/chat                ← Chat page (after login)
```

### Backend URLs
```
http://localhost:5000/api/auth/google           ← Initiate Google OAuth
http://localhost:5000/api/auth/google/callback  ← Google callback
http://localhost:5000/api/auth/github           ← Initiate GitHub OAuth
http://localhost:5000/api/auth/github/callback  ← GitHub callback
http://localhost:5000/api/auth/me               ← Get user profile
```

### OAuth Provider URLs
```
https://accounts.google.com/o/oauth2/v2/auth    ← Google OAuth
https://github.com/login/oauth/authorize        ← GitHub OAuth
```

---

## Environment Variables Flow

```
┌─────────────────────────────────────────────────────────┐
│                    .env Files                            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (.env)                                         │
│  ┌────────────────────────────────────────────────┐     │
│  │ NEXT_PUBLIC_API_URL=http://localhost:5000/api  │     │
│  └────────────────────────────────────────────────┘     │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────┐     │
│  │ LoginModal.tsx                                  │     │
│  │ const apiUrl = process.env.NEXT_PUBLIC_API_URL │     │
│  └────────────────────────────────────────────────┘     │
│                                                           │
│  Backend (.env)                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ FRONTEND_URL=http://localhost:3000             │     │
│  │ GOOGLE_CLIENT_ID=...                           │     │
│  │ GOOGLE_CLIENT_SECRET=...                       │     │
│  │ GITHUB_CLIENT_ID=...                           │     │
│  │ GITHUB_CLIENT_SECRET=...                       │     │
│  └────────────────────────────────────────────────┘     │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────┐     │
│  │ passport.js                                     │     │
│  │ clientID: process.env.GOOGLE_CLIENT_ID         │     │
│  │ callbackURL: process.env.GOOGLE_CALLBACK_URL   │     │
│  └────────────────────────────────────────────────┘     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. OAuth Provider Authentication                        │
│     ↓                                                     │
│     User proves identity to Google/GitHub                │
│                                                           │
│  2. Authorization Code Exchange                          │
│     ↓                                                     │
│     Backend exchanges code for access token              │
│                                                           │
│  3. User Profile Retrieval                               │
│     ↓                                                     │
│     Backend fetches user data from provider              │
│                                                           │
│  4. JWT Token Generation                                 │
│     ↓                                                     │
│     Backend creates signed JWT with user ID              │
│                                                           │
│  5. Token Storage                                        │
│     ↓                                                     │
│     Frontend stores JWT in Zustand state                 │
│                                                           │
│  6. Authenticated Requests                               │
│     ↓                                                     │
│     Frontend sends JWT in Authorization header           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User Data Flow:

Google/GitHub Profile
    ↓
{
  id: "123456",
  email: "user@gmail.com",
  displayName: "John Doe",
  photos: [{ value: "https://..." }]
}
    ↓
Backend Processing
    ↓
MongoDB User Document
{
  _id: ObjectId("..."),
  username: "John Doe",
  email: "user@gmail.com",
  provider: "google",
  providerId: "123456",
  avatarUrl: "https://...",
  isVerified: true
}
    ↓
JWT Token Generation
    ↓
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "...",
    username: "John Doe",
    email: "user@gmail.com",
    avatarUrl: "https://..."
  }
}
    ↓
Frontend Zustand Store
    ↓
User logged in and can access protected routes
```

---

## Timing Diagram

```
Time →

User          Frontend        Backend         OAuth Provider
 │                │              │                   │
 │  Click Login   │              │                   │
 ├───────────────▶│              │                   │
 │                │              │                   │
 │                │  Redirect    │                   │
 │                ├─────────────▶│                   │
 │                │              │                   │
 │                │              │  Redirect         │
 │                │              ├──────────────────▶│
 │                │              │                   │
 │  Authenticate  │              │                   │
 ├───────────────────────────────────────────────────▶│
 │                │              │                   │
 │                │              │  Callback         │
 │                │              │◀──────────────────┤
 │                │              │                   │
 │                │              │  Validate         │
 │                │              │  Create User      │
 │                │              │  Generate Token   │
 │                │              │                   │
 │                │  Redirect    │                   │
 │                │◀─────────────┤                   │
 │                │              │                   │
 │                │  Fetch User  │                   │
 │                ├─────────────▶│                   │
 │                │              │                   │
 │                │  User Data   │                   │
 │                │◀─────────────┤                   │
 │                │              │                   │
 │  Logged In     │              │                   │
 │◀───────────────┤              │                   │
 │                │              │                   │

Total Time: ~2-5 seconds
```

---

## Error Scenarios

### Scenario 1: User Cancels OAuth
```
User clicks "Cancel" on Google
    ↓
Google redirects to callback with error
    ↓
Backend catches error
    ↓
Redirects to /oauth-failure
    ↓
User sees "Authentication was cancelled"
```

### Scenario 2: Invalid Credentials
```
OAuth provider rejects credentials
    ↓
Backend receives error from Passport
    ↓
Redirects to /oauth-failure
    ↓
User sees error message
```

### Scenario 3: Network Error
```
Network timeout during OAuth
    ↓
Frontend/Backend timeout
    ↓
User sees error message
    ↓
Can retry authentication
```

---

**Last Updated:** 2026-05-22
**Status:** Complete ✅
