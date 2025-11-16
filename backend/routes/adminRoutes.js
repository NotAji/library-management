import express from 'express';
import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { getUsers, getBorrowedBooks } from '../controllers/adminController.js';
import { adminOnly } from '../middleware/authMIddlewate.js';
import { protect } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.use(protect, adminOnly)

router.get('/users', getUsers);

router.get('/borrowedBooks', getBorrowedBooks);

export default router;