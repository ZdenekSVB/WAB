import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

// Rozšíření typu Request pro přidání vlastnosti user
interface AuthenticatedRequest extends Request {
  user?: { _id: string }; // Přidána volitelná vlastnost user
}

const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: 'Authorization token required' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET as string) as { _id: string };

    const user = await User.findOne({ _id: decodedToken._id }).select('_id');
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = { _id: user._id.toString() }; // Přidání user do requestu
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

export default requireAuth;
