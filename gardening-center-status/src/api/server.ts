import { homepageController } from "./controllers/homepage/homepage.controller";
import { OrderStatusController } from "./controllers/orderStatus/orderStatus.controller";
import { apiErrorHandler } from "../middleware/error.middleware";
import express = require('express');
import cors = require('cors');
import { WarningController } from "./controllers/warning/warning.controller";

export const server = express();

// Allow CORS for process.env.CORS_ORIGIN
server.use(cors({
    origin: process.env.CORS_ORIGIN
}));
console.log('Allowed CORS for', process.env.CORS_ORIGIN);

// Middleware to parse JSON and URL-encoded data
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// --- ROUTES ---

// Homepage
server.get('/', homepageController.homepage);

// Order status
const orderStatusController = new OrderStatusController(); // Přejmenováno z AircraftStatusController
server.post('/orders/:id/status', orderStatusController.create);

// Warning
const warningController = new WarningController();
server.post('/warnings', warningController.create);

// --- END ROUTES ---

// Middleware: Error handling
server.use(apiErrorHandler);
