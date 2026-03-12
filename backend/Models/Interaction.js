import mongoose from "mongoose";
const interactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["like", "dislike"],
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ["text", "image"],
        required: true
    },
    detectedLanguage: {
        type: String,
        required: true
    },
    dificultyLevel: {
        type: String,
        enum: ["too easy", "easy", "medium", "hard","too hard"],
        required: true
    },
    chatHistory: {
        type: Array,
        default: []
    },
    // optional search context for this interaction
    searchQuery: {
        type: String,
        default: null
    },
    searchFilters: {
        type: Map,
        of: String,
        default: {}
    },
    searchResultsCount: {
        type: Number,
        default: null
    },
    topic: {
        type: String,
        default: null
    },
    // extras
    responseTimeMs: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: ''
    }
}, { timestamps: true });


const Interaction = mongoose.model("Interaction", interactionSchema);
export default Interaction;