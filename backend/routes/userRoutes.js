import express from "express"
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

export default router;