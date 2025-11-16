import express from "express"
import { userRegister, userLogin, borrowBook } from "../controllers/userController.js";
import { getBooks } from "../controllers/bookController.js";
import { protect } from "../middleware/authMIddlewate.js";

const router = express.Router();

router.post('/register', userRegister);

router.post('/login', userLogin);

router.post('/borrowBook', borrowBook)

router.get('/getBooks', getBooks)

export default router;