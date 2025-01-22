import { Request, Response } from 'express';
import Plant from '../models/plantModel';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../types';

// GET all plants
const getPlants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?._id;
    const plants = await Plant.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET a single plant
const getPlant = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No such plant' });
    return;
  }

  try {
    const plant = await Plant.findById(id);
    if (!plant) {
      res.status(404).json({ error: 'No such plant' });
      return;
    }
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST a new plant
const createPlant = async (req: AuthenticatedRequest, res: Response) => {
  const { name, species, wateringFrequency, imageUrl } = req.body;

  try {
    const user_id = req.user?._id;
    const plant = await Plant.create({ name, species, wateringFrequency, imageUrl, user_id });
    res.status(200).json(plant);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE a plant
const updatePlant = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, species, wateringFrequency, imageUrl } = req.body;

  try {
    const plant = await Plant.findOneAndUpdate(
        { _id: id },
        { name, species, wateringFrequency, imageUrl },
        { new: true }
    );
    if (!plant) {
      res.status(400).json({ error: 'No such plant' });
      return;
    }
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE a plant
const deletePlant = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'No such plant' });
    return;
  }

  try {
    const plant = await Plant.findOneAndDelete({ _id: id });
    if (!plant) {
      res.status(400).json({ error: 'No such plant' });
      return;
    }
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  createPlant,
  getPlants,
  getPlant,
  deletePlant,
  updatePlant,
};