import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user';
import plantRoutes from './routes/plants';
import messageRoutes from './routes/message';
import Message from './models/messageModel';
import path from 'path';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Statické soubory
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Routy
app.use('/api/user', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api', messageRoutes);

// Socket.IO připojení
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', async (message: { user: string; text: string }) => {
        try {
            console.log('Message received:', message);
            const newMessage = new Message({
                user: message.user,
                text: message.text,
                createdAt: new Date(),
            });
            await newMessage.save();
            console.log('Message saved:', newMessage);
            io.emit('receiveMessage', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Spuštění serveru
mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => {
        console.log('Connected to the database');
        server.listen(process.env.PORT || 4000, () => {
            console.log(`Server is running on port ${process.env.PORT || 4000}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
    });