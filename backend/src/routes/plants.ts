import express, { Request, Response } from 'express';
import plantController from '../controllers/plantController';
import requireAuth from '../middleware/requireAuth';

const router = express.Router();

// Vyžaduj autentizaci pro všechny routy
router.use(requireAuth);

// GET rostliny přihlášeného uživatele
router.get('/my-plants', (req: Request, res: Response) => plantController.getMyPlants(req, res));

// GET všechny rostliny (pro prohlížení)
router.get('/all-plants', (req: Request, res: Response) => plantController.getAllPlants(req, res));

// GET rostliny ostatních uživatelů
router.get('/other-users-plants', (req: Request, res: Response) => plantController.getOtherUsersPlants(req, res));

router.post('/like/:plantId', (req: Request, res: Response) => plantController.likePlant(req, res));

router.post('/unlike/:plantId', (req: Request, res: Response) => plantController.unlikePlant(req, res));

// GET jedna rostlina
router.get('/:id', (req: Request, res: Response) => plantController.getPlant(req, res));

// POST nová rostlina
router.post('/', (req: Request, res: Response) => plantController.createPlant(req, res));

// DELETE rostlina
router.delete('/:id', (req: Request, res: Response) => plantController.deletePlant(req, res));

// UPDATE rostlina
router.patch('/:id', (req: Request, res: Response) => plantController.updatePlant(req, res));

export default router;