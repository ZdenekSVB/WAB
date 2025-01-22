import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import userRoutes from './routes/user';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    credentials: true, // Allow cookies and credentials
}));

// Middleware for JSON
app.use(express.json());

// Use the user routes
app.use('/api/user', userRoutes);

// Start the server
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