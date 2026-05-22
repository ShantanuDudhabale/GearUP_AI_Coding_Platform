# Quick Fix for 404 Error - 30 Seconds

## Option 1: Use the Restart Script (Easiest)

**Double-click this file:**
```
restart-servers.bat
```

Wait 10 seconds, then browser will open automatically to `http://localhost:3000`

---

## Option 2: Manual Restart

### Step 1: Stop Everything
Press `Ctrl+C` in all terminal windows

### Step 2: Clean Frontend
```bash
cd frontend
rm -rf .next
```

### Step 3: Start Backend
```bash
cd backend
npm start
```

### Step 4: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

### Step 5: Open Browser
```
http://localhost:3000
```

---

## What URL Should I Use?

✅ **CORRECT:**
```
http://localhost:3000
```

❌ **WRONG:**
```
http://localhost:3000/home
http://localhost:3000/index
http://localhost:3000/undefined
```

---

## Still Getting 404?

### Check if servers are running:

**Backend check:**
```
http://localhost:5000/api/health
```
Should show: `{"status":"ok",...}`

**Frontend check:**
Look at terminal - should say:
```
▲ Next.js 14.2.35
- Local: http://localhost:3000
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| "Connection refused" | Server not running - start it |
| "Port already in use" | Kill process or restart computer |
| Still shows 404 | Clear browser cache (Ctrl+Shift+R) |
| Blank page | Check browser console for errors |

---

## Need Help?

1. Check `RESOLVE_404.md` for detailed guide
2. Check terminal outputs for errors
3. Check browser console (F12) for errors

---

**TL;DR:** Double-click `restart-servers.bat` and wait 10 seconds! 🚀
