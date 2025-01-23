import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/user';
import plantRoutes from './routes/plants';
import messageRoutes from './routes/message';
import Message from './models/messageModel';
import { setupSwagger } from './services/swagger';
import logger from './services/loggingService';

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = createServer(app);

// Initialize Socket.IO
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

// Serve static files
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api', messageRoutes);

// Swagger documentation
setupSwagger(app);

// Socket.IO connection handler
const setupSocketIO = () => {
    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.id}`);

        socket.on('sendMessage', async (message: { user: string; text: string }) => {
            try {
                logger.info(`Message received from user ${message.user}: ${message.text}`);
                const newMessage = new Message({
                    user: message.user,
                    text: message.text,
                    createdAt: new Date(),
                });
                await newMessage.save();
                logger.info(`Message saved: ${newMessage}`);
                io.emit('receiveMessage', newMessage);
            } catch (error) {
                logger.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.id}`);
        });
    });
};

// Start the server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        logger.info('Connected to the database');

        const port = process.env.PORT || 4000;
        server.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (err) {
        // Safely handle the 'unknown' type
        if (err instanceof Error) {
            logger.error('Error connecting to the database:', err.message);
        } else {
            logger.error('Error connecting to the database:', 'An unknown error occurred');
        }
        process.exit(1);
    }
};

// Initialize Socket.IO and start the server
setupSocketIO();
startServer();

// Export the app instance for testing
export default app;