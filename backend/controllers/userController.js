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
