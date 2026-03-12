import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() { return this.provider === 'local'; }
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },
    providerId: {
        type: String,
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    avatarUrl: {
        type: String,
        default: null
    },
    preferences: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuals for relationships
userSchema.virtual('progress', {
    ref: 'Progress',
    localField: '_id',
    foreignField: 'userId',
    justOne: true
});

userSchema.virtual('codingExperiences', {
    ref: 'CodingExperience',
    localField: '_id',
    foreignField: 'userId'
});

userSchema.virtual('interactions', {
    ref: 'Interaction',
    localField: '_id',
    foreignField: 'userId'
});
const User = mongoose.model("User", userSchema);
export default User;