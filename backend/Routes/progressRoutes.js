import express from 'express';
import authMiddleware from '../Middlewares/middleware.js';
import { getUserProgress } from '../Controllers/ProgressController.js';

const router = express.Router();

// get progress for current user
router.get('/', authMiddleware, getUserProgress);

export default router;

