import express, { Request, Response } from 'express';
import Message from '../models/messageModel';

const router = express.Router();

// GET všechny zprávy (seřazené od nejstarší po nejnovější)
router.get('/messages', async (req: Request, res: Response) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;