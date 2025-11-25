import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/database.js';
import bookRoutes from './routes/bookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend/src/pages')));

app.use('/api/user', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);

app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/login.html'));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  console.log('Awaiting database connection...');
});
