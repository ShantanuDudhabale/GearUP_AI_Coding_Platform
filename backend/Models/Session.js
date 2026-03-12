import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: 'New Chat'
    },
    messages: {
        type: Array,
        default: []
    },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
