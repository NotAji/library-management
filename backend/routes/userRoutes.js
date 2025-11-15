import express from "express"
import { userRegister, userLogin } from "../controllers/userController.js";
import { protect } from "../middleware/authMIddlewate.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.send("user home route")
})

router.get('/borrowed', (req, res) => {
    res.send("user borrowed books")
})

router.get('/profile', (req, res) => {
    res.send("user profile")
})

router.post('/register', userRegister)

router.post('/login', protect, userLogin)

export default router;