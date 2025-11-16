import express from 'express';
import { getBook, getBooks, createBook, updateBook, deleteBook } from '../controllers/adminController.js';

const router = express.Router();

router.get('/getBooks', getBooks);

router.get('/getBook', getBook);

router.post('/createBook', createBook);

router.put('/updateBook/id', updateBook);

router.delete('/deleteBook/id', deleteBook);

export default router;