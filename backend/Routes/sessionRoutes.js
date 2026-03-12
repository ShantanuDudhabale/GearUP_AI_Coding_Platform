import express from 'express';
import authMiddleware from '../Middlewares/middleware.js';
import { getSessions, createOrUpdateSession, deleteSession } from '../Controllers/SessionController.js';

const router = express.Router();

router.get('/', authMiddleware, getSessions);
router.post('/', authMiddleware, createOrUpdateSession);
router.delete('/:sessionId', authMiddleware, deleteSession);

export default router;
