import express from 'express';
import {
  userRegister,
  userLogin,
  borrowBook,
} from '../controllers/userController.js';
import { getBooks, getUserBooks } from '../controllers/bookController.js';
import { protect } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.post('/register', userRegister);

router.post('/login', userLogin);

router.post('/borrowBook/:id', borrowBook);

router.get('/getBooks', getBooks);

router.get('/userBooks', protect, getUserBooks);

export default router;
