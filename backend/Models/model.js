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
        required: true
    },
    // optional additional profile fields
    dob: {
        type: Date,
        required: false
    }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;