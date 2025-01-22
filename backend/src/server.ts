import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user';
import plantRoutes from './routes/plants';
import path from 'path';

dotenv.config();

const app = express();

// Povolte CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Zvýšení limitu velikosti těla požadavku na 10 MB
app.use(express.json({ limit: '10mb' })); // Zvýšení limitu pro JSON
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Zvýšení limitu pro URL-encoded data

// Serving statických souborů ze složky 'uploads'
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Použijte user routes
app.use('/api/user', userRoutes);

// Použijte plant routes
app.use('/api/plants', plantRoutes);

// Spusťte server
mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => {
        console.log('Connected to the database');
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server is running on port ${process.env.PORT || 4000}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
    });