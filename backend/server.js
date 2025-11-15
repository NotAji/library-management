import express from 'express'

const app = express();

app.get("/", (req, res) => {
    res.send("Connected to site...")
})

app.listen(5000, () => {
    console.log("server listening on port 5000");
});