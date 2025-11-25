import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;

    const totalBooks = await Book.countDocuments();

    const books = await Book.find()
      .populate('borrowedBy', 'name')
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    const books = await Book.find({ isBorrowed: false })
      .skip(skip)
      .limit(limit)
      .sort({ bookId: 1 });
    const totalBooks = await Book.countDocuments({ isBorrowed: false });
    if (!books) return res.status(404).json({ message: 'Books not found' });

    res.json({
      books,
      totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'borrowedBooks.bookId',
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    const books = user.borrowedBooks
      .filter((item) => item.bookId !== null)
      .map((item) => ({
        title: item.bookId.title,
        author: item.bookId.author,
        dateBorrowed: item.dateBorrowed,
      }));

    res.json({ borrowedBooks: books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBook = async (req, res) => {
  const { title, author } = req.body;

  try {
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!author) return res.status(400).json({ message: 'Author is required' });

    const lastBook = await Book.findOne().sort({ bookId: -1 });
    const bookId = lastBook ? lastBook.bookId + 1 : 1;

    const newBook = await Book.create({
      bookId,
      title,
      author,
      isBorrowed: false,
      borrowedBy: null,
      borrowedAt: null,
    });

    res.status(201).json({ message: 'Book created', book: newBook });
  } catch (error) {
    console.error('Create Book Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  const { title, author } = req.body;
  const bookId = Number(req.params.id);

  try {
    const book = await Book.findOne({ bookId });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.title = title || book.title;
    book.author = author || book.author;

    await book.save();
    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: Number(req.params.bookId) });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await User.updateMany(
      { 'borrowedBooks.bookId': book._id },
      { $pull: { borrowedBooks: { bookId: book._id } } },
    );

    await book.deleteOne();

    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Book.updateMany(
      { borrowedBy: user._id },
      {
        $set: {
          isBorrowed: false,
          borrowedBy: null,
          borrowedAt: null,
        },
      },
    );

    await user.deleteOne();

    res.json({ message: 'User deleted and book statuses reset.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
