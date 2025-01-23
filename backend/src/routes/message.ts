import express, { Request, Response } from 'express';
import Message from '../models/messageModel';
import logger from '../services/loggingService';

const router = express.Router();

// Utility function to handle errors
const handleError = (res: Response, error: any, message: string, statusCode: number = 500) => {
    logger.error(message, error);
    res.status(statusCode).json({ error: message });
};

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Získání všech zpráv (seřazené od nejstarší po nejnovější)
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Úspěšně vráceny zprávy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Chyba serveru
 */
router.get('/messages', async (req: Request, res: Response) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 });
        logger.info('Messages fetched successfully');
        res.status(200).json(messages);
    } catch (error) {
        handleError(res, error, 'Error fetching messages');
    }
});

export default router;