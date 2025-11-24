import User from '../models/userModel.js';
import Book from '../models/bookModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email alreasy exists' });

  try {
    const role = email.endsWith('@admin.com') ? 'admin' : 'user';

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    const token = generateToken(user._id, role);

    console.log(req.body);

    res
      .status(201)
      .json({ message: 'User registered', token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) return res.status(404).json({ message: 'Invalid password' });

    const token = generateToken(user._id, 'user');

    console.log(req.body);

    res.json({ message: 'Login successful', user, token, role: user.role });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const borrowBook = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.borrowedBooks.length >= 6) {
      return res
        .status(400)
        .json({ message: 'Borrow limit reached (6 books)' });
    }
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.isBorrowed) {
      return res.status(400).json({ message: 'Book is already borrowed' });
    }

    book.isBorrowed = true;
    user.borrowedBooks.push({
      bookId: book._id,
      dateBorrowed: new Date().toISOString().split('T')[0],
    });
    book.borrowedAt = new Date().toISOString().split('T')[0];
    book.borrowedBy = user.name;

    await book.save();
    await user.save();

    res.json({ message: 'Book borrowed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);

    console.log(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true },
    ).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect old password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password' });
  }
};
