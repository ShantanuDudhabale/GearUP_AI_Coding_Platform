import express from "express";
import passport from 'passport';
import { login, register, verifyEmail, deleteAccount } from "../Controllers/AuthController.js";
import authMiddleware from "../Middlewares/middleware.js";

const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);

// email verification
router.get('/verify/:token', verifyEmail);

// delete current account (settings page)
router.delete('/me', authMiddleware, deleteAccount);

// OAuth endpoints
// Google
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // passport sets req.user after successful auth
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${req.user.token}`);
});

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${req.user.token}`);
});

export default router;