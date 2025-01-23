import mongoose from 'mongoose';
import logger from '../services/loggingService';

export default async () => {
    try {
        // Drop the test database
        await mongoose.connection.dropDatabase();
        logger.info('Dropped the test database');

        // Close the database connection
        await mongoose.connection.close();
        logger.info('Closed the database connection');
    } catch (err) {
        logger.error('Error during global teardown:', err);
        process.exit(1);
    }
};