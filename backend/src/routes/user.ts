import express, { Response } from 'express';
import { loginUser, signupUser, updateUser, deleteUser } from '../controllers/userController';
import requireAuth from '../middleware/requireAuth';
import logger from '../services/loggingService';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

// Utility function to log route actions
const logRouteAction = (req: AuthenticatedRequest, action: string) => {
    const userId = req.user?._id;
    logger.info(`User ${userId} ${action}`);
};

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Přihlášení uživatele
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Úspěšné přihlášení
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Neplatné údaje
 */
router.post('/login', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'initiated login');
    loginUser(req, res);
});

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Registrace nového uživatele
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Úspěšná registrace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Neplatné údaje
 */
router.post('/signup', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'initiated signup');
    signupUser(req, res);
});

/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Aktualizace uživatele
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Úspěšná aktualizace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Neoprávněný přístup
 */
router.put('/update', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'initiated profile update');
    updateUser(req, res);
});
/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Smazání uživatele
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Úspěšné smazání
 *       401:
 *         description: Neoprávněný přístup
 */
router.delete('/delete', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'initiated account deletion');
    deleteUser(req, res);
});

export default router;