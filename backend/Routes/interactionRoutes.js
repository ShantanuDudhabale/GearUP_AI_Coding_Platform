import express from 'express';
import authMiddleware from '../Middlewares/middleware.js';
import { createInteraction, getUserInteractions } from '../Controllers/InteractionController.js';

const router = express.Router();

// store a single interaction and update user progress
router.post('/', authMiddleware, createInteraction);

// get interactions / search history for current user (with optional filters)
router.get('/', authMiddleware, getUserInteractions);

export default router;


