import express from 'express';
import authMiddleware from '../Middlewares/middleware.js';
import { createInteraction, getUserInteractions, getRecentInteractions } from '../Controllers/InteractionController.js';

const router = express.Router();

// Store a single interaction and update user progress
router.post('/', authMiddleware, createInteraction);

// Get interactions / search history for current user (with optional filters)
router.get('/', authMiddleware, getUserInteractions);

// Get the N most recent interactions for the dashboard activity feed
router.get('/recent', authMiddleware, getRecentInteractions);

export default router;
