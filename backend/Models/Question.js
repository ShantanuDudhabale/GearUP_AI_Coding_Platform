import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    language: {
        type: String,
        enum: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'HTML', 'CSS', 'SQL', 'Arduino'],
        required: true,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'easy', 'medium', 'hard', 'expert'],
        required: true,
        index: true
    },
    topic: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: ['syntax', 'loops', 'functions', 'arrays', 'objects', 'classes', 'algorithms', 'data-structures', 'debugging', 'best-practices', 'project'],
        required: true
    },
    question: {
        type: String,
        required: true
    },
    hints: [{
        type: String
    }],
    expectedAnswer: {
        type: String,
        default: null
    },
    codeExample: {
        type: String,
        default: null
    },
    explanation: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    xpReward: {
        type: Number,
        default: 10
    },
    timeEstimate: {
        type: Number, // in minutes
        default: 5
    },
    prerequisites: [{
        type: String
    }],
    relatedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    usageCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Indexes for efficient querying
questionSchema.index({ language: 1, difficulty: 1, category: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ isActive: 1, usageCount: 1 });

const Question = mongoose.model("Question", questionSchema);
export default Question;
