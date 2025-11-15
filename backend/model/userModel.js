import mongoose from 'mongoose';

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
    borrowedBooks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);