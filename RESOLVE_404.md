# How to Resolve the 404 Error

## What's Happening

You're seeing a Next.js 404 page that says "This page could not be found." This can happen for several reasons:

1. Frontend server not running
2. Accessing a route that doesn't exist
3. Build cache issues
4. Port conflicts

## Solution Steps

### Step 1: Stop All Running Servers

```bash
# Press Ctrl+C in all terminal windows running servers
# Or close all terminals
```

### Step 2: Clean Build Cache

```bash
# Navigate to frontend
cd frontend

# Remove build cache and node_modules
rm -rf .next
rm -rf node_modules
rm -rf .turbo

# Reinstall dependencies
npm install
```

### Step 3: Start Backend Server

```bash
# Open Terminal 1
cd backend
npm start
```

**Expected output:**
```
✅ Server is running on port 5000
📍 Health check: http://localhost:5000/api/health
PASSPORT DEBUG | Google Strategy successfully registered
PASSPORT DEBUG | GitHub Strategy successfully registered
```

### Step 4: Start Frontend Server

```bash
# Open Terminal 2
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
- Ready in X.Xs
```

### Step 5: Access the Correct URL

Open your browser to:
```
http://localhost:3000
```

**NOT:**
- `http://localhost:3000/undefined`
- `http://localhost:3000/null`
- Any other path that doesn't exist

## Available Routes

These routes should work:

✅ `http://localhost:3000/` - Landing page
✅ `http://localhost:3000/login` - Login page
✅ `http://localhost:3000/chat` - Chat page (requires login)
✅ `http://localhost:3000/dashboard` - Dashboard (requires login)
✅ `http://localhost:3000/oauth-success` - OAuth success handler
✅ `http://localhost:3000/oauth-failure` - OAuth failure handler
✅ `http://localhost:3000/test-oauth` - OAuth testing page

## If Still Getting 404

### Check 1: Verify Frontend is Running

Open a new terminal:
```bash
curl http://localhost:3000
```

If you get "Connection refused", the frontend isn't running.

### Check 2: Check for Port Conflicts

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# If ports are in use, kill the processes or use different ports
```

### Check 3: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Check 4: Check Console for Errors

1. Open DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Share the errors if you see any

### Check 5: Verify Environment Variables

**Frontend `.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend `.env`:**
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Common Mistakes

### ❌ Wrong URL
```
http://localhost:3000/home  ← Doesn't exist
http://localhost:3000/index ← Doesn't exist
```

### ✅ Correct URL
```
http://localhost:3000/      ← Landing page
```

### ❌ Server Not Running
If you see "This site can't be reached", the server isn't running.

### ✅ Server Running
You should see the CodeMentorAI landing page with the logo and "Get Started" button.

## Quick Fix Script

Create a file `restart.sh` (or `restart.bat` on Windows):

```bash
#!/bin/bash

# Kill existing processes
pkill -f "node.*backend"
pkill -f "node.*frontend"

# Clean frontend
cd frontend
rm -rf .next
npm install

# Start backend
cd ../backend
npm start &

# Start frontend
cd ../frontend
npm run dev
```

Then run:
```bash
chmod +x restart.sh
./restart.sh
```

## Windows Quick Fix

Create `restart.bat`:

```batch
@echo off
echo Cleaning and restarting servers...

cd frontend
if exist .next rmdir /s /q .next
call npm install

cd ..\backend
start cmd /k npm start

cd ..\frontend
start cmd /k npm run dev

echo Servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
```

Double-click `restart.bat` to run.

## Still Not Working?

### Check Frontend Terminal Output

Look for errors like:
- `Error: listen EADDRINUSE: address already in use :::3000`
  → Port 3000 is already in use
  
- `Module not found: Can't resolve '@/components/...'`
  → Missing dependencies, run `npm install`
  
- `Error: ENOENT: no such file or directory`
  → File missing, check if all files exist

### Check Backend Terminal Output

Look for errors like:
- `Error: listen EADDRINUSE: address already in use :::5000`
  → Port 5000 is already in use
  
- `MongoServerError: Authentication failed`
  → MongoDB connection issue
  
- `PASSPORT DEBUG | GOOGLE_CLIENT_ID: MISSING`
  → Environment variables not loaded

## Test Checklist

After restarting, verify:

- [ ] Backend terminal shows "Server is running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] Opening `http://localhost:3000` shows landing page (not 404)
- [ ] Opening `http://localhost:5000/api/health` shows JSON
- [ ] No errors in browser console
- [ ] No errors in terminal outputs

## Contact Support

If none of these work, provide:

1. Screenshot of frontend terminal
2. Screenshot of backend terminal
3. Screenshot of browser console (F12)
4. The exact URL you're trying to access
5. Your operating system

---

**Quick Summary:**

1. Stop all servers (Ctrl+C)
2. Clean frontend: `cd frontend && rm -rf .next && npm install`
3. Start backend: `cd backend && npm start`
4. Start frontend: `cd frontend && npm run dev`
5. Open: `http://localhost:3000`

That should fix the 404 error! 🚀
