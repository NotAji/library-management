import User from '../models/userModel.js'; 
import Book from '../models/bookModel.js';
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js';

export const userRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await User.findOne({ email });
        if(exists) return res.status(400).json({ message: "Email alreasy exists"});

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        const token = generateToken(user._id, "user");

        res.status(201).json({ message: "User registered", user, token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found"});
   
        const isUser = await bcrypt.compare(password, user.password);
        if(!isUser) return res.status(404).json({ message: "Invalid password"});

        res.json({ message: "Login successful", user})
    } catch (error) {
        res.status(404).json({ error: error.message})
    }
}

export const borrowBook = async (req, res) => {
    const { bookId } = req.body;

    try {
        const user = await User.findOne(email);
        if(!user) return res.status(400).json({ message: "User not found"});
        
        if (user.borrowedBooks.length >= 3) {
            return res.status(400).json({ message: "Borrow limit reached (3 books)" });
        }
        const book = await Book.findById(bookId);
        if(!book) return res.status(404).json({ message: "Book not found" });
        if(book.isBorrowed) {
            return res.status(400).json({ message: "Book is already borrowed"});
        }

        book.isBorrowed = true;
        user.borrowedBooks.push(book._id);

        await book.save();
        await user.save();

        res.json({ message: "Book borrowed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}