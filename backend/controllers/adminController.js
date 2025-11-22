import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Book.find({ isBorrowed: true });
    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isReturned = async (req, res) => {
  const { bookID } = req.body;

  try {
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.isBorrowed) {
      return res.status(400).json({ message: 'Book is not borrowed' });
    }

    const user = await User.FindOne(book.borrowedBy);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.borrowedBooks = user.borrowedBooks.filter(
      (bId) => bId.toString() !== book._id.toString(),
    );

    await user.save();

    book.isBorrowed = false;
    book.borrowedBy = null;
    await book.save();

    res.json({ message: 'Book returned succesfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
