import express, { Express } from 'express';
import bodyParser from 'body-parser';
import userRoutes from '../routes/user'; // Import your routes
import logger from '../services/loggingService';

// Create an Express app
const app: Express = express();

// Add middleware
app.use(bodyParser.json());

// Add routes
app.use('/api/user', userRoutes);

// Export the app for use in tests
export default app;