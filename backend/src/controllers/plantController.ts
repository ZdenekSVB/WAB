import express, { Request, Response } from 'express';
import Plant from '../models/plantModel';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../types';

const getMyPlants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?._id;
    const plants = await Plant.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET všechny rostliny (pro prohlížení)
const getAllPlants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 }); // Načti všechny rostliny
    res.status(200).json(plants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET rostliny konkrétního uživatele
const getUserPlants = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    const plants = await Plant.find({ user_id: userId }).sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Lajkování rostliny
const likePlant = async (req: AuthenticatedRequest, res: Response) => {
  const { plantId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    // Uživatel nemůže lajkovat svou vlastní rostlinu
    if (plant.user_id === userId) {
      return res.status(400).json({ error: 'You cannot like your own plant' });
    }

    // Uživatel může lajkovat pouze jednou
    if (plant.likedBy.includes(userId)) {
      return res.status(400).json({ error: 'You have already liked this plant' });
    }

    plant.likes += 1;
    plant.likedBy.push(userId);
    await plant.save();

    res.status(200).json(plant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

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
  getAllPlants,
  getMyPlants,
  getPlant,
  deletePlant,
  updatePlant,
  getUserPlants,
  likePlant,
};