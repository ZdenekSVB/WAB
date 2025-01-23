import express, { Request, Response } from 'express';
import { loginUser, signupUser, updateUser, deleteUser } from '../controllers/userController';
import requireAuth from '../middleware/requireAuth';

const router = express.Router();

// POST přihlášení uživatele
router.post('/login', (req: Request, res: Response) => loginUser(req, res));

// POST registrace uživatele
router.post('/signup', (req: Request, res: Response) => signupUser(req, res));

// PUT aktualizace uživatele (vyžaduje autentizaci)
router.put('/update', requireAuth, (req: Request, res: Response) => updateUser(req, res));

// DELETE smazání uživatele (vyžaduje autentizaci)
router.delete('/delete', requireAuth, (req: Request, res: Response) => deleteUser(req, res));

export default router;