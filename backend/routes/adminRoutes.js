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

router.get('/users', getUsers);

router.get('/borrowedBooks', getBorrowedBooks);

router.post('/returnBook/:id', isReturned);

export default router;
