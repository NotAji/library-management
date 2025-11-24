import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find({ role: 'user' }).skip(skip).limit(limit);
    res.json({ users, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBorrowedBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const borrowedBooks = await Book.find({ isBorrowed: true })
      .skip(skip)
      .limit(limit);

    const totalBorrowed = await Book.countDocuments({ isBorrowed: true });
    res.json({ borrowedBooks, totalBorrowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isReturned = async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.isBorrowed) {
      return res.status(400).json({ message: 'Book is not borrowed' });
    }

    const user = await User.findOne({ name: book.borrowedBy });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.borrowedBooks = user.borrowedBooks.filter(
      (b) => b.bookId.toString() !== book._id.toString(),
    );
    await user.save();

    book.isBorrowed = false;
    book.borrowedBy = [];
    book.borrowedAt = null;
    await book.save();

    res.json({ message: 'Book returned successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
