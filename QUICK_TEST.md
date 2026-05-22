# Quick Test - 2 Minutes

## 1. Start Servers (30 seconds)

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

## 2. Test Backend (15 seconds)

Open in browser:
- http://localhost:5000/api/health ✅
- http://localhost:5000/api/auth/test ✅

## 3. Test OAuth URLs (30 seconds)

Open: http://localhost:3000/test-oauth
- Click "Calculate OAuth URLs"
- Click "Test Google OAuth" → Should redirect ✅
- Click "Test GitHub OAuth" → Should redirect ✅

## 4. Test Login Flow (30 seconds)

Open: http://localhost:3000
- Click "Log In"
- Open Console (F12)
- Click "Google" → Check console for URL ✅
- Should redirect to Google ✅

## 5. Test Cursor (15 seconds)

- On `/` → Move mouse → Cursor glow visible ✅
- Go to `/chat` → Cursor glow gone ✅
- Back to `/` → Cursor glow back ✅

---

## Expected Results

### Backend Console:
```
✅ Server is running on port 5000
PASSPORT DEBUG | Google Strategy successfully registered
PASSPORT DEBUG | GitHub Strategy successfully registered
```

### When clicking OAuth:
```
Backend: 🔵 Google OAuth route hit
Frontend: 🔵 Google OAuth URL: http://localhost:5000/api/auth/google
```

---

## If Something Fails:

### 404 on OAuth?
```bash
# Restart backend
cd backend && npm start
```

### Cursor not showing?
```
Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
```

### Still broken?
See `DEBUG_OAUTH.md` for detailed troubleshooting

---

**Status:** All fixes applied ✅
**Time to test:** ~2 minutes
