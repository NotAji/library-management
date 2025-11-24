import express from 'express';
import {
  userRegister,
  userLogin,
  borrowBook,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/userController.js';
import { getBooks, getUserBooks } from '../controllers/bookController.js';
import { protect } from '../middleware/authMIddlewate.js';

const router = express.Router();

router.post('/register', userRegister);

router.post('/login', userLogin);

router.post('/borrowBook/:id', protect, borrowBook);

router.get('/getBooks', protect, getBooks);

router.get('/userBooks', protect, getUserBooks);

router.get('/profile', protect, getProfile);

router.put('/updateProfile', protect, updateProfile);

router.put('/changePassword', protect, changePassword);

export default router;
