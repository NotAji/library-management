import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    borrowedBooks: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        dateBorrowed: { type: Date, default: Date.now },
      },
    ],
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
