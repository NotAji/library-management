import express from 'express';
import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, adminOnly } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.get('/getBook/:id', getBook);

router.get('/getBooks', getBooks);

router.post('/createBook', protect, adminOnly, createBook);

router.put('/updateBook/:id', protect, adminOnly, updateBook);

router.delete('/deleteBook/:id', protect, adminOnly, deleteBook);

export default router;