import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("successfully connected to database...")
    } catch (error) {
        console.error("database connection failed...",error)
    }
}

export default connectDB;