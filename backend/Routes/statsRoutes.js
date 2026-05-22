import express from 'express';
import UserStats from '../Models/UserStats.js';
import { protect } from '../Middlewares/middleware.js';

const router = express.Router();

// Get user stats
router.get('/', protect, async (req, res) => {
    try {
        let stats = await UserStats.findOne({ userId: req.user._id });
        
        // Create default stats if not exists
        if (!stats) {
            stats = await UserStats.create({
                userId: req.user._id,
                dailyChallenges: [
                    {
                        id: '1',
                        title: 'Create a Button Click Counter',
                        description: 'Build a simple counter that increases when you click a button',
                        difficulty: 'easy',
                        xpReward: 50,
                        language: 'JavaScript',
                        completed: false
                    },
                    {
                        id: '2',
                        title: 'Build a Temperature Converter',
                        description: 'Convert between Celsius and Fahrenheit',
                        difficulty: 'medium',
                        xpReward: 100,
                        language: 'Python',
                        completed: false
                    }
                ]
            });
        }
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user stats
router.put('/', protect, async (req, res) => {
    try {
        const stats = await UserStats.findOneAndUpdate(
            { userId: req.user._id },
            req.body,
            { new: true, upsert: true }
        );
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add XP
router.post('/xp', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        
        const stats = await UserStats.findOneAndUpdate(
            { userId: req.user._id },
            { $inc: { xp: amount } },
            { new: true, upsert: true }
        );
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unlock badge
router.post('/badges', protect, async (req, res) => {
    try {
        const { badgeId } = req.body;
        
        const stats = await UserStats.findOne({ userId: req.user._id });
        
        if (!stats.badges.includes(badgeId)) {
            stats.badges.push(badgeId);
            stats.xp += 50;
            await stats.save();
        }
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete exercise
router.post('/exercises', protect, async (req, res) => {
    try {
        const { language } = req.body;
        
        const stats = await UserStats.findOne({ userId: req.user._id });
        
        // Update skill
        const skill = stats.skills.find(s => s.skill === language);
        if (skill) {
            skill.level = Math.min(100, skill.level + 2);
            skill.exercises += 1;
            skill.lastPracticed = new Date().toISOString();
        }
        
        stats.exercisesSolved += 1;
        stats.xp += 20;
        
        await stats.save();
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit project
router.post('/projects', protect, async (req, res) => {
    try {
        const stats = await UserStats.findOneAndUpdate(
            { userId: req.user._id },
            { 
                $inc: { 
                    projectsSubmitted: 1,
                    xp: 100
                }
            },
            { new: true, upsert: true }
        );
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete challenge
router.post('/challenges/:challengeId', protect, async (req, res) => {
    try {
        const stats = await UserStats.findOne({ userId: req.user._id });
        
        const challenge = stats.dailyChallenges.find(c => c.id === req.params.challengeId);
        if (challenge && !challenge.completed) {
            challenge.completed = true;
            stats.xp += challenge.xpReward;
            await stats.save();
        }
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
