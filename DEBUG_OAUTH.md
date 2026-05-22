# OAuth Debugging Guide

## Step 1: Verify Backend is Running

Open a terminal and run:

```bash
cd backend
npm start
```

You should see:
```
✅ Server is running on port 5000
📍 Health check: http://localhost:5000/api/health
PASSPORT DEBUG | GOOGLE_CLIENT_ID: SET
PASSPORT DEBUG | GOOGLE_CLIENT_SECRET: SET
PASSPORT DEBUG | Google Strategy successfully registered
PASSPORT DEBUG | GITHUB_CLIENT_ID: SET
PASSPORT DEBUG | GITHUB_CLIENT_SECRET: SET
PASSPORT DEBUG | GitHub Strategy successfully registered
```

## Step 2: Test Backend Routes

Open your browser or use curl to test these URLs:

### Test Health Endpoint
```
http://localhost:5000/api/health
```
Expected: `{"status":"ok","message":"Backend is running","timestamp":"..."}`

### Test Auth Routes
```
http://localhost:5000/api/auth/test
```
Expected: `{"message":"Auth routes are working","googleConfigured":true,"githubConfigured":true}`

### Test Google OAuth Route
```
http://localhost:5000/api/auth/google
```
Expected: Should redirect to Google OAuth consent screen (NOT 404)

### Test GitHub OAuth Route
```
http://localhost:5000/api/auth/github
```
Expected: Should redirect to GitHub OAuth authorization screen (NOT 404)

## Step 3: Check Frontend Configuration

1. Navigate to `http://localhost:3000/test-oauth`
2. Click "Calculate OAuth URLs"
3. Verify the URLs shown match:
   - Google: `http://localhost:5000/api/auth/google`
   - GitHub: `http://localhost:5000/api/auth/github`

## Step 4: Test OAuth Flow

1. Go to `http://localhost:3000`
2. Click "Log In" button
3. Open browser DevTools (F12) → Console tab
4. Click "Google" button
5. Check console for: `🔵 Google OAuth URL: http://localhost:5000/api/auth/google`
6. Should redirect to Google (not 404)

## Common Issues and Solutions

### Issue 1: 404 on OAuth Routes

**Symptom:** Clicking Google/GitHub shows "Cannot GET /api/auth/google"

**Solutions:**
1. Restart backend server:
   ```bash
   cd backend
   npm start
   ```

2. Verify environment variables in `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
   GITHUB_CLIENT_ID=YOUR_CLIENT_ID
   GITHUB_CLIENT_SECRET=YOUR_CLIENT_SECRET
   ```

3. Check if passport strategies are registered (look for console logs on server start)

### Issue 2: Cursor Not Appearing

**Symptom:** No custom cursor glow on landing page

**Solutions:**
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check you're on the landing page (`/`)
3. Open DevTools → Console and check for errors
4. Verify `CursorGlow` component is mounted

### Issue 3: Cursor Appearing on Wrong Pages

**Symptom:** Custom cursor shows on chat/dashboard pages

**Solutions:**
1. Clear browser cache
2. Restart frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

## Backend Server Logs

When OAuth routes are hit, you should see:

```
🔵 Google OAuth route hit
```
or
```
🟣 GitHub OAuth route hit
```

If you don't see these logs, the routes aren't being reached.

## Frontend Console Logs

When clicking OAuth buttons, you should see:

```
🔵 Google OAuth URL: http://localhost:5000/api/auth/google
```
or
```
🟣 GitHub OAuth URL: http://localhost:5000/api/auth/github
```

## Network Tab Inspection

1. Open DevTools → Network tab
2. Click "Google" button
3. You should see:
   - Request to `http://localhost:5000/api/auth/google`
   - Status: 302 (Redirect)
   - Location header pointing to Google OAuth

If you see:
- Status: 404 → Backend route not found
- Status: 500 → Server error (check backend logs)
- CORS error → CORS configuration issue

## Restart Everything

If nothing works, restart both servers:

```bash
# Terminal 1
cd backend
npm start

# Terminal 2  
cd frontend
npm run dev
```

Then clear browser cache and try again.

## Check Passport Configuration

The backend should log these on startup:

```
PASSPORT DEBUG | GOOGLE_CLIENT_ID: SET
PASSPORT DEBUG | GOOGLE_CLIENT_SECRET: SET
PASSPORT DEBUG | Google Strategy successfully registered
PASSPORT DEBUG | GITHUB_CLIENT_ID: SET
PASSPORT DEBUG | GITHUB_CLIENT_SECRET: SET
PASSPORT DEBUG | GitHub Strategy successfully registered
```

If you see "MISSING" instead of "SET", check your `.env` file.

## Manual URL Test

Try accessing these URLs directly in your browser:

1. `http://localhost:5000/api/health` → Should show JSON
2. `http://localhost:5000/api/auth/test` → Should show auth config
3. `http://localhost:5000/api/auth/google` → Should redirect to Google
4. `http://localhost:5000/api/auth/github` → Should redirect to GitHub

If any of these show 404, the backend routes aren't configured correctly.
