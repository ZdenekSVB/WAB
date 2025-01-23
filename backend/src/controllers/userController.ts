import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';
import logger from '../services/loggingService';

// Utility function to create JWT token
const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.SECRET as string, { expiresIn: '3d' });
};

// Utility function to handle errors
const handleError = (res: Response, error: any, message: string, statusCode: number = 400) => {
  logger.error(message, error);
  res.status(statusCode).json({ error: message });
};

// Utility function to validate required fields
const validateRequiredFields = (fields: { [key: string]: any }, res: Response): boolean => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      logger.warn(`Missing required field: ${key}`);
      res.status(400).json({ error: `${key} is required` });
      return false;
    }
  }
  return true;
};

// Utility function to find user by email or nickname
const findUser = async (email?: string, nickname?: string) => {
  if (email) return await User.findOne({ email });
  if (nickname) return await User.findOne({ nickname });
  return null;
};

// Přihlášení uživatele
// In userController.ts
const loginUser = async (req: Request, res: Response) => {
  const { email, nickname, password } = req.body;

  if (!validateRequiredFields({ password, emailOrNickname: email || nickname }, res)) return;

  try {
    const user = await findUser(email, nickname);
    if (!user) {
      logger.warn(`User not found: ${email || nickname}`);
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for user: ${user.email}`);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = createToken(user._id);
    logger.info(`User logged in: ${user.email}`);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      token,
    });
  } catch (error) {
    handleError(res, error, 'Error during login');
  }
};

// Registrace nového uživatele
const signupUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, nickname } = req.body;

  if (!validateRequiredFields({ email, password, firstName, lastName, nickname }, res)) return;

  try {
    const user = await User.signup(email, password, firstName, lastName, nickname);
    const token = createToken(user._id);
    logger.info(`User registered: ${user.email}`);
    res.status(200).json({ email: user.email, token });
  } catch (error) {
    handleError(res, error, 'Error during signup');
  }
};

// Aktualizace uživatele (heslo)
const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { password } = req.body;

  if (!req.user) {
    logger.warn('Unauthorized update attempt');
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!validateRequiredFields({ password }, res)) return;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      logger.warn(`User not found: ${req.user._id}`);
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = createToken(user._id);
    logger.info(`User updated: ${user.email}`);
    res.status(200).json({ token });
  } catch (error) {
    handleError(res, error, 'Error updating user');
  }
};

// Smazání uživatele
const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    logger.warn('Unauthorized delete attempt');
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    await User.deleteUser(req.user._id);
    logger.info(`User deleted: ${req.user._id}`);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Error deleting user');
  }
};

export { signupUser, loginUser, updateUser, deleteUser, createToken };