import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    exercises: {
        type: Number,
        default: 0
    },
    lastPracticed: {
        type: String,
        default: () => new Date().toISOString()
    }
});

const challengeSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    difficulty: String,
    xpReward: Number,
    language: String,
    completed: {
        type: Boolean,
        default: false
    }
});

const userStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    completedLessons: {
        type: Number,
        default: 0
    },
    savedCodes: {
        type: Number,
        default: 0
    },
    weakTopics: {
        type: [String],
        default: ['Loops', 'Functions', 'Arrays']
    },
    streak: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    },
    badges: {
        type: [String],
        default: []
    },
    skills: {
        type: [skillSchema],
        default: []
    },
    exercisesSolved: {
        type: Number,
        default: 0
    },
    projectsSubmitted: {
        type: Number,
        default: 0
    },
    errorFrequency: {
        type: Number,
        default: 0
    },
    currentLevel: {
        type: String,
        default: 'Beginner'
    },
    dailyChallenges: {
        type: [challengeSchema],
        default: []
    }
}, { timestamps: true });

const UserStats = mongoose.model("UserStats", userStatsSchema);
export default UserStats;
