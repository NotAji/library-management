import express from 'express';
import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { adminOnly } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.get('/getBook', adminOnly, getBook);

router.get('/getBooks', adminOnly, getBooks);

router.post('/createBook', adminOnly, createBook);

router.put('/updateBook/id', adminOnly, updateBook);

router.delete('/deleteBook/id', adminOnly, deleteBook);

export default router;