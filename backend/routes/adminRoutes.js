import express from 'express';
import {
  getUsers,
  getBorrowedBooks,
  isReturned,
} from '../controllers/adminController.js';
import { adminOnly } from '../middleware/authMIddlewate.js';
import { protect } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', protect, adminOnly, getUsers);

router.get('/borrowedBooks', protect, adminOnly, getBorrowedBooks);

router.post('/returnBook/:id', protect, adminOnly, isReturned);

export default router;
