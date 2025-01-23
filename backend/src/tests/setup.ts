// src/tests/setup.ts
import express, { Express } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from '../routes/user'; // Import your routes
import logger from '../services/loggingService';

// Create an Express app
const app: Express = express();

// Add middleware
app.use(bodyParser.json());

// Add routes
app.use('/api/user', userRoutes);

// Use a different port for testing
const port = process.env.TEST_PORT || 5000;

// Connect to the test database
beforeAll(async () => {
    const testDbUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/garden-buddy-test';
    await mongoose.connect(testDbUri);
    logger.info('Connected to the test database');

    // Start the server on the test port
    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
});

// Export the app for use in tests
export default app;