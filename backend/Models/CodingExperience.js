import mongoose from "mongoose";

const codingExperienceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    yearsExperience: {
        type: Number,
        default: 0
    },
    primaryLanguages: {
        type: [String],
        default: []
    },
    secondaryLanguages: {
        type: [String],
        default: []
    },
    githubUrl: {
        type: String,
        default: null
    },
    portfolioUrl: {
        type: String,
        default: null
    },
    // free-form description of experience or biography
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const CodingExperience = mongoose.model("CodingExperience", codingExperienceSchema);
export default CodingExperience;
