import { Request, Response } from 'express';
import Workout from '../models/workoutModel';
import mongoose, { Types } from 'mongoose';

// get all workouts
const getWorkouts = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = (req as any).user._id; // Explicitní přetypování pro vlastnost `user`
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// get a single workout
const getWorkout = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No such workout' });
    return;
  }

  try {
    const workout = await Workout.findById(id);
    if (!workout) {
      res.status(404).json({ error: 'No such workout' });
      return;
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// create new workout
const createWorkout = async (req: Request, res: Response): Promise<void> => {
  const { title, load, reps } = req.body;

  const emptyFields: string[] = [];
  if (!title) emptyFields.push('title');
  if (!load) emptyFields.push('load');
  if (!reps) emptyFields.push('reps');

  if (emptyFields.length > 0) {
    res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    return;
  }

  try {
    const user_id = (req as any).user._id; // Explicitní přetypování pro vlastnost `user`
    const workout = await Workout.create({ title, load, reps, user_id });
    res.status(200).json(workout);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// delete a workout
const deleteWorkout = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No such workout' });
    return;
  }

  try {
    const workout = await Workout.findOneAndDelete({ _id: id });
    if (!workout) {
      res.status(400).json({ error: 'No such workout' });
      return;
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// update a workout
const updateWorkout = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No such workout' });
    return;
  }

  try {
    const workout = await Workout.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
    );

    if (!workout) {
      res.status(400).json({ error: 'No such workout' });
      return;
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
};
