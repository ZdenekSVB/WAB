import { Request, Response } from 'express';
import Plant from '../models/plantModel';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../types';
import logger from '../services/loggingService';

// Utility function to handle errors
const handleError = (res: Response, error: any, message: string, statusCode: number = 500) => {
  logger.error(message, error);
  res.status(statusCode).json({ error: message });
};

// Utility function to validate ObjectId
const validateObjectId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Invalid ID: ${id}`);
    res.status(404).json({ error: 'Invalid ID' });
    return false;
  }
  return true;
};

// Utility function to find a plant by ID
const findPlantById = async (id: string, res: Response) => {
  if (!validateObjectId(id, res)) return null;

  try {
    const plant = await Plant.findById(id);
    if (!plant) {
      logger.warn(`Plant not found with ID: ${id}`);
      res.status(404).json({ error: 'No such plant' });
      return null;
    }
    return plant;
  } catch (error) {
    handleError(res, error, `Error fetching plant with ID: ${id}`);
    return null;
  }
};

// Získání rostlin přihlášeného uživatele
const getMyPlants = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?._id;
  try {
    const plants = await Plant.find({ user_id }).sort({ createdAt: -1 });
    logger.info(`User ${user_id} fetched their plants`);
    res.status(200).json(plants);
  } catch (error) {
    handleError(res, error, 'Error fetching user plants');
  }
};

// Získání všech rostlin (pro prohlížení)
const getAllPlants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    logger.info('All plants fetched successfully');
    res.status(200).json(plants);
  } catch (error) {
    handleError(res, error, 'Error fetching all plants');
  }
};

// Získání rostlin konkrétního uživatele
const getUserPlants = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  try {
    const plants = await Plant.find({ user_id: userId }).sort({ createdAt: -1 });
    logger.info(`Plants for user ${userId} fetched successfully`);
    res.status(200).json(plants);
  } catch (error) {
    handleError(res, error, `Error fetching plants for user ${userId}`);
  }
};

// Získání jedné rostliny podle ID
const getPlant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const plant = await findPlantById(id, res);
  if (plant) {
    logger.info(`Plant fetched with ID: ${id}`);
    res.status(200).json(plant);
  }
};

// Vytvoření nové rostliny
const createPlant = async (req: AuthenticatedRequest, res: Response) => {
  const { name, species, wateringFrequency, imageUrl } = req.body;
  const user_id = req.user?._id;

  try {
    const plant = await Plant.create({ name, species, wateringFrequency, imageUrl, user_id });
    logger.info(`Plant created by user ${user_id}`);
    res.status(200).json(plant);
  } catch (error: any) {
    handleError(res, error, 'Error creating plant', 400);
  }
};

// Aktualizace rostliny
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
      logger.warn(`Plant not found with ID: ${id}`);
      return res.status(400).json({ error: 'No such plant' });
    }
    logger.info(`Plant updated with ID: ${id}`);
    res.status(200).json(plant);
  } catch (error) {
    handleError(res, error, `Error updating plant with ID: ${id}`);
  }
};

// Smazání rostliny
const deletePlant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const plant = await findPlantById(id, res);
  if (plant) {
    try {
      await Plant.findOneAndDelete({ _id: id });
      logger.info(`Plant deleted with ID: ${id}`);
      res.status(200).json(plant);
    } catch (error) {
      handleError(res, error, `Error deleting plant with ID: ${id}`);
    }
  }
};

// Lajkování rostliny
const likePlant = async (req: AuthenticatedRequest, res: Response) => {
  const { plantId } = req.params;
  const userEmail = req.user?.email;

  if (!userEmail) {
    logger.warn('User not authenticated');
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const plant = await findPlantById(plantId, res);
  if (!plant) return;

  if (plant.user_id === req.user?._id) {
    logger.warn(`User ${userEmail} tried to like their own plant`);
    return res.status(400).json({ error: 'You cannot like your own plant' });
  }

  if (plant.likedBy.includes(userEmail)) {
    logger.warn(`User ${userEmail} already liked plant ${plantId}`);
    return res.status(400).json({ error: 'You have already liked this plant' });
  }

  plant.likes += 1;
  plant.likedBy.push(userEmail);
  await plant.save();
  logger.info(`User ${userEmail} liked plant ${plantId}`);
  res.status(200).json(plant);
};

// Odlajkování rostliny
const unlikePlant = async (req: AuthenticatedRequest, res: Response) => {
  const { plantId } = req.params;
  const userEmail = req.user?.email;

  if (!userEmail) {
    logger.warn('User not authenticated');
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const plant = await findPlantById(plantId, res);
  if (!plant) return;

  if (plant.likedBy.includes(userEmail)) {
    plant.likes -= 1;
    plant.likedBy = plant.likedBy.filter((email: string) => email !== userEmail);
    await plant.save();
    logger.info(`User ${userEmail} unliked plant ${plantId}`);
    res.status(200).json(plant);
  } else {
    logger.warn(`User ${userEmail} tried to unlike a plant they did not like`);
    res.status(400).json({ error: 'You have not liked this plant' });
  }
};

// Získání rostlin ostatních uživatelů
const getOtherUsersPlants = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?._id;
  try {
    const plants = await Plant.find({ user_id: { $ne: user_id } }).sort({ createdAt: -1 });
    logger.info(`User ${user_id} fetched other users' plants`);
    res.status(200).json(plants);
  } catch (error) {
    handleError(res, error, 'Error fetching other users\' plants');
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