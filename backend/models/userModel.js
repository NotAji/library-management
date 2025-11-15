import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    borrowedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        default: []
    }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);