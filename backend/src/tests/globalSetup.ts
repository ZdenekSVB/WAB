// src/tests/globalSetup.ts
import mongoose from 'mongoose';
import app from '../server'; // Import your Express app
import logger from '../services/loggingService';

// Use a different port for testing
const port = process.env.TEST_PORT || 5000;

export default async () => {
    try {
        // Check if a connection already exists
        if (mongoose.connection.readyState === 0) { // 0 = disconnected
            const testDbUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/garden-buddy-test';
            await mongoose.connect(testDbUri);
            logger.info('Connected to the test database');
        }

        // Start the server on the test port
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (err) {
        logger.error('Error during global setup:', err);
        process.exit(1);
    }
};