import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const db = () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("seuccessfully connected to database...")
    } catch (error) {
        console.log(error)
    }
}

db();

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});

app.use("/", userRoutes)