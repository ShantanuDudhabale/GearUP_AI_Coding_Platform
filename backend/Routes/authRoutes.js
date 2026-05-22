import express from "express";
import passport from 'passport';
import { login, register, verifyEmail, deleteAccount, getMe } from "../Controllers/AuthController.js";
import authMiddleware from "../Middlewares/middleware.js";

const router = express.Router();

// ─── Email/Password Auth ────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);

// Get current authenticated user's full profile (used by /oauth-success page)
router.get('/me', authMiddleware, getMe);

// Email verification
router.get('/verify/:token', verifyEmail);

// Delete current account
router.delete('/me', authMiddleware, deleteAccount);

// ─── OAuth ─────────────────────────────────────────────────────────────────

// Google — initiate
router.get('/google', (req, res, next) => {
  try {
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
  } catch (err) {
    const msg = encodeURIComponent('Google OAuth is not configured on this server.');
    res.redirect(`${process.env.FRONTEND_URL}/oauth-failure?message=${msg}`);
  }
});

// Google — callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      const message = err?.message || 'Google authentication failed';
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-failure?message=${encodeURIComponent(message)}`);
    }
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${user.token}`);
  })(req, res, next);
});

// GitHub — initiate
router.get('/github', (req, res, next) => {
  try {
    passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
  } catch (err) {
    const msg = encodeURIComponent('GitHub OAuth is not configured on this server.');
    res.redirect(`${process.env.FRONTEND_URL}/oauth-failure?message=${msg}`);
  }
});

// GitHub — callback
router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user) => {
    if (err || !user) {
      const message = err?.message || 'GitHub authentication failed';
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-failure?message=${encodeURIComponent(message)}`);
    }
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${user.token}`);
  })(req, res, next);
});

export default router;