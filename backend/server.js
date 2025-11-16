import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/database.js'

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/user", userRoutes);
// app.use("/api/admin", userRoutes);


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
