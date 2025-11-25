import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ role: 'user' });

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
      .populate('borrowedBy', 'name')
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

    // Use ObjectId reference stored in borrowedBy
    const user = await User.findById(book.borrowedBy);
    if (user) {
      // Remove the book from the user's borrowedBooks array
      user.borrowedBooks = user.borrowedBooks.filter(
        (b) => b.bookId.toString() !== book._id.toString(),
      );
      await user.save();
    }

    // Reset the book
    book.isBorrowed = false;
    book.borrowedBy = null;
    book.borrowedAt = null;
    await book.save();

    res.status(200).json({ message: 'Book returned successfully', book });
  } catch (error) {
    console.error('Return Book Error:', error);
    res
      .status(500)
      .json({ message: 'Failed to return book', error: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: 'Missing fields' });

    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });

    admin.name = name;
    admin.email = email;

    await admin.save();

    res.json({ message: 'Profile updated successfully', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: 'Both fields are required' });

    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
