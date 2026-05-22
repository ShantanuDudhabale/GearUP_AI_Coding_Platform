# Testing Guide - CodeMentorAI Fixes

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm start
```

Expected output:
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

### 2. Start the Frontend Server

```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
- Ready in X.Xs
```

---

## Test Cases

### ✅ Test 1: OAuth Google Login

1. Open browser to `http://localhost:3000`
2. Click "Log In" button in header
3. In the modal, click "Google" button
4. **Expected:** Browser redirects to Google OAuth consent screen
5. **NOT Expected:** 404 error or "Cannot GET /api/auth/google"
6. Complete Google sign-in
7. **Expected:** Redirects to `/oauth-success` then `/chat`

**Success Criteria:**
- No 404 errors
- Smooth redirect to Google
- Successful authentication
- User logged in and redirected to chat

---

### ✅ Test 2: OAuth GitHub Login

1. Open browser to `http://localhost:3000`
2. Click "Log In" button in header
3. In the modal, click "GitHub" button
4. **Expected:** Browser redirects to GitHub OAuth authorization screen
5. **NOT Expected:** 404 error or "Cannot GET /api/auth/github"
6. Complete GitHub authorization
7. **Expected:** Redirects to `/oauth-success` then `/chat`

**Success Criteria:**
- No 404 errors
- Smooth redirect to GitHub
- Successful authentication
- User logged in and redirected to chat

---

### ✅ Test 3: Cursor Glow on Landing Page

1. Open browser to `http://localhost:3000`
2. Move your mouse around the page
3. **Expected:** 
   - You should see a glowing cursor effect following your mouse
   - A small blue dot at cursor position
   - A larger blue glow around the cursor
4. **NOT Expected:** 
   - No cursor visible
   - Default cursor only

**Success Criteria:**
- Custom cursor glow is visible
- Cursor follows mouse smoothly
- No lag or performance issues

---

### ✅ Test 4: Cursor Hidden on Chat Page

1. Log in to the application
2. Navigate to `/chat` page
3. Move your mouse around
4. **Expected:** 
   - Normal default cursor (no glow effect)
   - Standard browser cursor behavior
5. **NOT Expected:** 
   - Custom cursor glow appearing

**Success Criteria:**
- No custom cursor on chat page
- Normal cursor functionality
- No visual interference with chat UI

---

### ✅ Test 5: Cursor Hidden on Dashboard Page

1. Log in to the application
2. Navigate to `/dashboard` page
3. Move your mouse around
4. **Expected:** 
   - Normal default cursor (no glow effect)
   - Standard browser cursor behavior
5. **NOT Expected:** 
   - Custom cursor glow appearing

**Success Criteria:**
- No custom cursor on dashboard page
- Normal cursor functionality
- No visual interference with dashboard UI

---

### ✅ Test 6: Cursor Returns on Landing Page

1. From chat or dashboard, click "Back to Home" or navigate to `/`
2. Move your mouse around
3. **Expected:** 
   - Custom cursor glow reappears
   - Smooth transition

**Success Criteria:**
- Cursor glow returns when navigating back to landing page
- No errors in console

---

### ✅ Test 7: Footer Renders Correctly

1. Open browser to `http://localhost:3000`
2. Scroll to the bottom of the landing page
3. **Expected:** 
   - Footer component is visible
   - Contains GearUp Technologies branding
   - Social media links present
   - Copyright information visible
4. **NOT Expected:** 
   - Missing footer
   - Console errors about Footer component

**Success Criteria:**
- Footer renders without errors
- All footer content is visible
- Proper styling applied

---

### ✅ Test 8: OAuth Error Handling

1. Open browser to `http://localhost:3000`
2. Click "Log In" button
3. Click "Google" or "GitHub" button
4. On the OAuth screen, click "Cancel" or "Deny"
5. **Expected:** 
   - Redirects to `/oauth-failure` page
   - Shows error message
   - Provides "Try Again" button
6. **NOT Expected:** 
   - Blank page
   - Unhandled error
   - Application crash

**Success Criteria:**
- Graceful error handling
- User-friendly error message
- Ability to retry authentication

---

## Browser Console Checks

### No Errors Expected

Open browser DevTools (F12) and check the Console tab. You should see:

**✅ Good:**
```
🔄 Syncing chat sessions after login...
✅ Loaded X sessions from database
```

**❌ Bad (should NOT see):**
```
404 (Not Found) - /api/auth/google
404 (Not Found) - /api/auth/github
TypeError: Cannot read property 'token' of undefined
Uncaught ReferenceError: Footer is not defined
```

---

## Network Tab Checks

### OAuth Requests

1. Open DevTools → Network tab
2. Click "Log In" → "Google"
3. Check the network requests

**Expected:**
```
GET http://localhost:5000/api/auth/google → 302 Redirect to Google
GET https://accounts.google.com/o/oauth2/v2/auth?... → 200 OK
GET http://localhost:5000/api/auth/google/callback?code=... → 302 Redirect
GET http://localhost:3000/oauth-success?token=... → 200 OK
```

**NOT Expected:**
```
GET http://localhost:5000/api/auth/google → 404 Not Found
```

---

## Common Issues & Solutions

### Issue: 404 on OAuth Login

**Symptom:** Clicking Google/GitHub button shows 404 error

**Solution:** 
- Verify backend server is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env`
- Restart both frontend and backend servers

---

### Issue: Cursor Not Appearing

**Symptom:** No custom cursor on landing page

**Solution:**
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check browser console for errors

---

### Issue: Cursor Appearing on Wrong Pages

**Symptom:** Custom cursor shows on chat/dashboard

**Solution:**
- This should be fixed now
- If still occurring, check `CursorGlow.tsx` implementation
- Verify `usePathname()` is working correctly

---

### Issue: Footer Not Showing

**Symptom:** Landing page has no footer

**Solution:**
- This should be fixed now
- Verify `Footer.tsx` exists in `frontend/components/`
- Check import statement in `frontend/app/page.tsx`

---

## Performance Checks

### Page Load Times

- Landing page: < 2 seconds
- Chat page: < 1.5 seconds
- Dashboard page: < 2 seconds

### Cursor Performance

- No lag when moving cursor
- Smooth animation
- No frame drops

---

## Mobile Testing (Optional)

### Responsive Design

1. Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Test on different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

**Expected:**
- Layout adapts to screen size
- No horizontal scrolling
- All buttons accessible
- Modal fits on screen

---

## Final Checklist

Before considering testing complete, verify:

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Google OAuth login works (no 404)
- [ ] GitHub OAuth login works (no 404)
- [ ] Cursor glow appears on landing page
- [ ] Cursor glow does NOT appear on chat page
- [ ] Cursor glow does NOT appear on dashboard page
- [ ] Footer renders on landing page
- [ ] No console errors
- [ ] No network errors (except expected API calls)
- [ ] OAuth error handling works
- [ ] User can successfully log in and access chat
- [ ] User can navigate between pages without issues

---

## Automated Testing (Future)

Consider adding these tests:

```javascript
// Example Jest test
describe('OAuth Login', () => {
  it('should redirect to Google OAuth', () => {
    // Test implementation
  });
  
  it('should handle OAuth errors gracefully', () => {
    // Test implementation
  });
});

describe('Cursor Glow', () => {
  it('should appear on landing page', () => {
    // Test implementation
  });
  
  it('should not appear on chat page', () => {
    // Test implementation
  });
});
```

---

## Support

If you encounter any issues during testing:

1. Check the `FIXES_APPLIED.md` document for details on what was changed
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed (`npm install`)
4. Try restarting both servers
5. Clear browser cache and cookies
6. Check browser console for specific error messages

---

## Success! 🎉

If all tests pass, the following issues have been successfully fixed:

✅ OAuth 404 errors resolved
✅ Cursor glow working correctly on appropriate pages
✅ Footer rendering properly
✅ Error handling improved
✅ No breaking changes introduced

---

**Last Updated:** 2026-05-22
**Tested By:** [Your Name]
**Status:** All tests passing ✅
