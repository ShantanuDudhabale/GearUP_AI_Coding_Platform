import mongoose from "mongoose";
const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalInteractions: {
        type: Number,
        default: 0
    },
    strikeCount: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0 
    },
    languageStats: {
        type: Map,
        of: Number,
        default: {}
    },
    topicStats: {
        type: Map,
        of: Number,
        default: {}
    },
    difficultyStats: {
        type: Map,
        of: Number,
        default: {}
    },
    completionPercentage: {
        type: Number,
        default: 0
    },
    lastInteraction: {
        type: Date,
        default: null
    },
    xp_points: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    solvedQuestions: {
        type: Number,
        default: 0
    },
    mostlyIteractedLanguage: {
        type: String,
        default: null
    },
    mostlyIteractedTopic: {
        type: String,
        default: null
    },
    mostlyIteractedDifficulty: {
        type: String,
        default: null
    },
    HighestStreak: {
        type: Number,
        default: 0  
    },
    ExamplesSolved: {
        type: Number,
        default: 0
    },
    // optional extra info
    achievements: {
        type: [String],
        default: []
    },
    favoriteLanguages: {
        type: [String],
        default: []
    },
    // track sessions or devices if desired
    sessions: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;