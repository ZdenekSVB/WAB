import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import User from '../models/userModel';
import { AuthenticatedRequest } from '../types';
import logger from '../services/loggingService';

// Utility function to handle authorization errors
const handleAuthError = (res: Response, message: string, statusCode: number = 401) => {
  logger.warn(message);
  res.status(statusCode).json({ error: message });
};

// Utility function to verify and decode the JWT token
const verifyToken = (token: string): { _id: string } | null => {
  try {
    return jwt.verify(token, process.env.SECRET as string) as { _id: string };
  } catch (err) {
    logger.error('Error verifying token', err);
    return null;
  }
};

// Utility function to find user by ID
const findUserById = async (userId: string) => {
  return await User.findById(userId).select('_id email');
};

// Middleware to require authentication
const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  // Validate authorization header
  if (!authorization) {
    return handleAuthError(res, 'Authorization token required');
  }

  // Extract token from header
  const token = authorization.split(' ')[1];
  if (!token) {
    return handleAuthError(res, 'Invalid token format');
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return handleAuthError(res, 'Request is not authorized');
  }

  // Find user by ID from token
  const user = await findUserById(decoded._id);
  if (!user) {
    return handleAuthError(res, 'User not found');
  }

  // Attach user to request object
  req.user = {
    _id: user._id.toString(),
    email: user.email,
    token,
  };

  logger.info(`User authenticated: ${user.email}`);
  next();
};

export default requireAuth;