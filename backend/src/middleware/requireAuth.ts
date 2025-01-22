import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import User from '../models/userModel';
import { AuthenticatedRequest } from '../types';

const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as { _id: string };
    const user = await User.findById(decoded._id).select('_id email');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      token,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

export default requireAuth;