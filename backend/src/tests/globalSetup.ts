import mongoose from 'mongoose';
import { startServer } from '../server'; // Import the startServer function
import logger from '../services/loggingService';

// Use the test port from .env.test
const port = process.env.TEST_PORT || 5000;

export default async () => {
    try {
        // Connect to the test database with a longer timeout
        const testDbUri = process.env.TEST_MONGO_URI;
        if (!testDbUri) {
            throw new Error('TEST_MONGO_URI is not defined in .env.test');
        }
        await mongoose.connect(testDbUri, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 30000, // 30 seconds
        });
        logger.info('Connected to the test database');

        // Start the server on the test port
        await startServer();
    } catch (err) {
        logger.error('Error during global setup:', err);
        process.exit(1);
    }
};