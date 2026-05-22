import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    steps: [{
        id: String,
        title: String,
        content: String,
        language: String,
        simulation: {
            components: [{
                type: String,
                pin: Number,
                name: String,
                icon: String
            }],
            behavior: [{
                component: String,
                action: String,
                timing: Number,
                value: mongoose.Schema.Types.Mixed
            }],
            description: String
        }
    }],
    language: String,
    timestamp: {
        type: String,
        required: true
    }
});

const chatSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: 'New Chat'
    },
    messages: [chatMessageSchema],
    updatedAt: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;
