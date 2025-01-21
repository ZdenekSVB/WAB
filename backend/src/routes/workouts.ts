import express, { Request, Response } from 'express';
import workoutController from '../controllers/workoutController';

const { createWorkout, getWorkouts, getWorkout, deleteWorkout, updateWorkout } = workoutController;

// ostatní kód zůstává beze změny

import requireAuth from '../middleware/requireAuth';

const router = express.Router();

// require auth for all workout routes
router.use(requireAuth);

// GET all workouts
router.get('/', (req: Request, res: Response) => getWorkouts(req, res));

// GET a single workout
router.get('/:id', (req: Request, res: Response) => getWorkout(req, res));

// POST a new workout
router.post('/', (req: Request, res: Response) => createWorkout(req, res));

// DELETE a workout
router.delete('/:id', (req: Request, res: Response) => deleteWorkout(req, res));

// UPDATE a workout
router.patch('/:id', (req: Request, res: Response) => updateWorkout(req, res));

export default router;