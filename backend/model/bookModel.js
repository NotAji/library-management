import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isBorrowed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);