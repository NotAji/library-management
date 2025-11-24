import express from 'express';
import {
  getUsers,
  getBorrowedBooks,
  isReturned,
} from '../controllers/adminController.js';
import { deleteUser } from '../controllers/bookController.js';
import { adminOnly } from '../middleware/authMIddlewate.js';
import { protect } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.get('/users', protect, adminOnly, getUsers);

router.get('/borrowedBooks', protect, adminOnly, getBorrowedBooks);

router.post('/returnBook/:id', protect, adminOnly, isReturned);

router.delete('/deleteUser/:id', protect, adminOnly, deleteUser);

export default router;
