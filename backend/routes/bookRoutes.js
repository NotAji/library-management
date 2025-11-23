import express from 'express';
import {
  getBook,
  getBooks,
  getAvailableBooks,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect, adminOnly } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.get('/getBook/:id', protect, getBook);

router.get('/available', protect, getAvailableBooks);

router.get('/getBooks', protect, adminOnly, getBooks);

router.post('/createBook', protect, adminOnly, createBook);

router.put('/updateBook/:id', protect, adminOnly, updateBook);

router.delete('/deleteBook/:bookId', protect, adminOnly, deleteBook);

export default router;
