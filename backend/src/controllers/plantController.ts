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

const likePlant = async (req: AuthenticatedRequest, res: Response) => {
  const { plantId } = req.params;
  const userEmail = req.user?.email; // Používáme email místo _id

  if (!userEmail) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    if (plant.user_id === req.user?._id) {
      return res.status(400).json({ error: 'You cannot like your own plant' });
    }

    if (plant.likedBy.includes(userEmail)) {
      return res.status(400).json({ error: 'You have already liked this plant' });
    }

    plant.likes += 1;
    plant.likedBy.push(userEmail); // Ukládáme email uživatele
    await plant.save();

    res.status(200).json(plant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const unlikePlant = async (req: AuthenticatedRequest, res: Response) => {
  const { plantId } = req.params;
  const userEmail = req.user?.email; // Používáme email místo _id

  if (!userEmail) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    if (plant.likedBy.includes(userEmail)) {
      plant.likes -= 1;
      plant.likedBy = plant.likedBy.filter((email: string) => email !== userEmail); // Odebereme email uživatele
      await plant.save();
      res.status(200).json(plant);
    } else {
      res.status(400).json({ error: 'You have not liked this plant' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getOtherUsersPlants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user?._id;
    const plants = await Plant.find({ user_id: { $ne: user_id } }).sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  getOtherUsersPlants,
  unlikePlant,
  createPlant,
  getAllPlants,
  getMyPlants,
  getPlant,
  deletePlant,
  updatePlant,
  getUserPlants,
  likePlant,
};