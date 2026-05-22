import express from 'express';
import ChatSession from '../Models/ChatSession.js';
import { protect } from '../Middlewares/middleware.js';

const router = express.Router();

// Get all chat sessions for a user
router.get('/sessions', protect, async (req, res) => {
    try {
        const sessions = await ChatSession.find({ userId: req.user._id })
            .sort({ updatedAt: -1 })
            .limit(50);
        
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific chat session
router.get('/sessions/:sessionId', protect, async (req, res) => {
    try {
        const session = await ChatSession.findOne({
            userId: req.user._id,
            sessionId: req.params.sessionId
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new chat session
router.post('/sessions', protect, async (req, res) => {
    try {
        const { sessionId, title } = req.body;
        
        const session = await ChatSession.create({
            userId: req.user._id,
            sessionId: sessionId || Date.now().toString(),
            title: title || 'New Chat',
            messages: [],
            updatedAt: new Date().toISOString()
        });
        
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a message to a session
router.post('/sessions/:sessionId/messages', protect, async (req, res) => {
    try {
        const { message } = req.body;
        
        const session = await ChatSession.findOne({
            userId: req.user._id,
            sessionId: req.params.sessionId
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        session.messages.push(message);
        session.updatedAt = new Date().toISOString();
        
        // Auto-title on first user message
        if (message.role === 'user' && session.messages.length === 1) {
            session.title = message.content.substring(0, 30) + 
                           (message.content.length > 30 ? '...' : '');
        }
        
        await session.save();
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a chat session
router.delete('/sessions/:sessionId', protect, async (req, res) => {
    try {
        const result = await ChatSession.deleteOne({
            userId: req.user._id,
            sessionId: req.params.sessionId
        });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update session title
router.patch('/sessions/:sessionId', protect, async (req, res) => {
    try {
        const { title } = req.body;
        
        const session = await ChatSession.findOneAndUpdate(
            { userId: req.user._id, sessionId: req.params.sessionId },
            { title, updatedAt: new Date().toISOString() },
            { new: true }
        );
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
