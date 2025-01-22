import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user';
import workoutRoutes from './routes/workouts'; // Import workout routes

dotenv.config();

const app = express();

// Povolte CORS
app.use(cors({
    origin: 'http://localhost:3000', // Povolte požadavky z frontendu
    credentials: true,
}));

// Middleware pro JSON
app.use(express.json());

// Použijte user routes
app.use('/api/user', userRoutes);

// Použijte workout routes
app.use('/api/workouts', workoutRoutes); // Přidejte workout routes

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