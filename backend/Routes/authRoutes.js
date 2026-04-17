import express from "express";
import passport from 'passport';
import { login, register, verifyEmail, deleteAccount, getMe } from "../Controllers/AuthController.js";
import authMiddleware from "../Middlewares/middleware.js";

const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);

// Get current authenticated user's full profile (used by /oauth-success page)
router.get('/me', authMiddleware, getMe);

// Email verification
router.get('/verify/:token', verifyEmail);

// Delete current account
router.delete('/me', authMiddleware, deleteAccount);

// ─── OAuth ─────────────────────────────────────────────────────────────────

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      const message = err?.message || 'Google authentication failed';
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-failure?message=${encodeURIComponent(message)}`);
    }
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${user.token}`);
  })(req, res, next);
});

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${req.user.token}`);
});

export default router;