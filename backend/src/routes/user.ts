import express, { Request, Response } from 'express';
import { loginUser, signupUser } from '../controllers/userController';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => loginUser(req, res));

router.post('/signup', (req: Request, res: Response) => signupUser(req, res));

export default router;