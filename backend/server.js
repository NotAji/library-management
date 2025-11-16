import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import connectDB from './config/database.js'
import bookRoutes from './routes/bookRoutes.js'

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/books", bookRoutes);


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
