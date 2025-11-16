import express from 'express';

const router = express.Router();

router.get('/getBooks', (req, res) => {
    res.send("Get books");
});

router.post('/createBook', (req, res) => {
    res.send("create book");
});

router.put('/updateBook/id', (req, res) => {
    res.send("update book");
});

router.delete('/deleteBook/id', (req, res) => {
    res.send("delete book");
});