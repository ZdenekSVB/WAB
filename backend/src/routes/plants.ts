import express, { Response } from 'express';
import plantController from '../controllers/plantController';
import requireAuth from '../middleware/requireAuth';
import logger from '../services/loggingService';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

// Middleware to require authentication for all routes
router.use(requireAuth);

// Utility function to log route actions
const logRouteAction = (req: AuthenticatedRequest, action: string) => {
    const userId = req.user?._id;
    const plantId = req.params.id || req.params.plantId;
    logger.info(`User ${userId} ${action}${plantId ? ` plant ${plantId}` : ''}`);
};

/**
 * @swagger
 * /api/plants/my-plants:
 *   get:
 *     summary: Získání rostlin přihlášeného uživatele
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Úspěšně vráceny rostliny uživatele
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plant'
 *       401:
 *         description: Neoprávněný přístup
 */
router.get('/my-plants', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'fetched their plants');
    plantController.getMyPlants(req, res);
});

/**
 * @swagger
 * /api/plants/all-plants:
 *   get:
 *     summary: Získání všech rostlin (pro prohlížení)
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Úspěšně vráceny všechny rostliny
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plant'
 *       401:
 *         description: Neoprávněný přístup
 */
router.get('/all-plants', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'fetched all plants');
    plantController.getAllPlants(req, res);
});

/**
 * @swagger
 * /api/plants/other-users-plants:
 *   get:
 *     summary: Získání rostlin ostatních uživatelů
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Úspěšně vráceny rostliny ostatních uživatelů
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plant'
 *       401:
 *         description: Neoprávněný přístup
 */
router.get('/other-users-plants', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'fetched other users\' plants');
    plantController.getOtherUsersPlants(req, res);
});

/**
 * @swagger
 * /api/plants/like/{plantId}:
 *   post:
 *     summary: Lajkování rostliny
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rostliny
 *     responses:
 *       200:
 *         description: Úspěšné lajkování rostliny
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         description: Nelze lajkovat vlastní rostlinu nebo již lajkováno
 *       401:
 *         description: Neoprávněný přístup
 */
router.post('/like/:plantId', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'liked');
    plantController.likePlant(req, res);
});

/**
 * @swagger
 * /api/plants/unlike/{plantId}:
 *   post:
 *     summary: Odlajkování rostliny
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rostliny
 *     responses:
 *       200:
 *         description: Úspěšné odlajkování rostliny
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         description: Nelze odlajkovat, pokud nebylo lajkováno
 *       401:
 *         description: Neoprávněný přístup
 */
router.post('/unlike/:plantId', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'unliked');
    plantController.unlikePlant(req, res);
});

/**
 * @swagger
 * /api/plants/{id}:
 *   get:
 *     summary: Získání jedné rostliny podle ID
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rostliny
 *     responses:
 *       200:
 *         description: Úspěšně vrácena rostlina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       404:
 *         description: Rostlina nebyla nalezena
 *       401:
 *         description: Neoprávněný přístup
 */
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'fetched');
    plantController.getPlant(req, res);
});

/**
 * @swagger
 * /api/plants:
 *   post:
 *     summary: Vytvoření nové rostliny
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlantInput'
 *     responses:
 *       200:
 *         description: Úspěšně vytvořena rostlina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         description: Neplatné údaje
 *       401:
 *         description: Neoprávněný přístup
 */
router.post('/', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'created a new plant');
    plantController.createPlant(req, res);
});

/**
 * @swagger
 * /api/plants/{id}:
 *   delete:
 *     summary: Smazání rostliny
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rostliny
 *     responses:
 *       200:
 *         description: Úspěšně smazána rostlina
 *       404:
 *         description: Rostlina nebyla nalezena
 *       401:
 *         description: Neoprávněný přístup
 */
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'deleted');
    plantController.deletePlant(req, res);
});

/**
 * @swagger
 * /api/plants/{id}:
 *   patch:
 *     summary: Aktualizace rostliny
 *     tags: [Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rostliny
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlantInput'
 *     responses:
 *       200:
 *         description: Úspěšně aktualizována rostlina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plant'
 *       400:
 *         description: Neplatné údaje
 *       401:
 *         description: Neoprávněný přístup
 */
router.patch('/:id', (req: AuthenticatedRequest, res: Response) => {
    logRouteAction(req, 'updated');
    plantController.updatePlant(req, res);
});

export default router;