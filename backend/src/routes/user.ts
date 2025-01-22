import express, { Request, Response } from 'express';
import { loginUser, signupUser, updateUser } from '../controllers/userController';
import requireAuth from '../middleware/requireAuth'; // Přidáno requireAuth

const router = express.Router();

router.post('/login', (req: Request, res: Response) => loginUser(req, res));
router.post('/signup', (req: Request, res: Response) => signupUser(req, res));
router.put('/update', requireAuth, (req: Request, res: Response) => updateUser(req, res)); // Přidáno requireAuth

export default router;