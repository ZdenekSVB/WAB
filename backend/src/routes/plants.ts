import express, { Request, Response } from 'express';
import plantController from '../controllers/plantController';
import requireAuth from '../middleware/requireAuth';

const { createPlant, getPlant, deletePlant, updatePlant } = plantController;

const router = express.Router();

// require auth for all plant routes
router.use(requireAuth);

// GET rostliny přihlášeného uživatele
router.get('/my-plants', plantController.getMyPlants);

// GET všechny rostliny (pro prohlížení)
router.get('/all-plants', plantController.getAllPlants);

// POST lajkování rostliny
router.post('/like/:plantId', plantController.likePlant);


// GET a single plant
router.get('/:id', (req: Request, res: Response) => getPlant(req, res));

// POST a new plant
router.post('/', (req: Request, res: Response) => createPlant(req, res));

// DELETE a plant
router.delete('/:id', (req: Request, res: Response) => deletePlant(req, res));

// UPDATE a plant
router.patch('/:id', (req: Request, res: Response) => updatePlant(req, res));

export default router;