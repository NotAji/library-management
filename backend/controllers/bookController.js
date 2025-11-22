import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const books = await Book.find({ isBorrowed: false });
    if (!books) return res.status(404).json({ message: 'Books not found' });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'borrowedBooks.bookId',
    );

    if (!user) return res.status(404).json({ message: 'Books not found' });

    const books = user.borrowedBooks.map((item) => ({
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
    if (!title) return res.status(400).json({ message: 'title required' });
    if (!author) return res.status(400).json({ message: 'author required' });

    const lastBook = await Book.findOne().sort({ bookId: -1 });
    const bookId = lastBook ? lastBook.bookId + 1 : 1;

    const newBook = await Book.create({
      bookId,
      title,
      author,
    });

    res.status(201).json({ message: 'Book Created', book: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  const { title, author } = req.body;

  try {
    const book = await Book.findOne({ bookId: req.params.id });

    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (title) book.title = title;
    if (author) book.author = author;

    await book.save();
    res.json({ message: 'Book updated', book: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ bookId: req.params.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.deleteOne();

    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
