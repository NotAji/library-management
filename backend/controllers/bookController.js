import Book from '../models/bookModel.js'

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

export const getBook = async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: req.params.id });
        if (!book) return res.status(404).json({ message: "Book not found"});
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createBook = async (req, res) => {
    const { title } = req.body;

    try {
        if (!title) return res.status(400).json({ message: "title required"});

        const lastBook = await Book.findOne().sort({ bookId: -1});
        const bookId = lastBook ? lastBook.bookId +1 : 1;

        const newBook = await Book.create({
            bookId,
            title,
        });

        res.status(201).json({ message: "Book Created", book: newBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateBook = async (req, res) => {
    const { title } = req.body;

    try {
        const book = await Book.findOne({ bookId: req.params.id });

        if(!book) return res.status(404).json({ message: "Book not found" });

        if (title) book.title = title;

        await book.save();
        res.json({ message: "Book updated", book: book});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: req.params.id });
        if (!book) return res.status(404).json({ message: "Book not found"});

        await book.deleteOne();

        res.json({ message: "Book deleted" });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}