import mongoose from "mongoose";
import Counter from './counter.js'

const bookSchema = new mongoose.Schema({
    bookId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    isBorrowed: {
        type: Boolean,
        default: false
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });

bookSchema.pre("save", async function(next) {
    if(!this.isNew) return next();
    const counter = await Counter.findByIdAndUpdate(
        { _id: "bookId" },
        { $inc: { seq:1 } },
        { new: true, upsert: true }
    );
    
    this.bookId = counter.seq;
    next();
})

export default mongoose.model("Book", bookSchema);