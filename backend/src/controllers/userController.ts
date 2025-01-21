import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.SECRET as string, { expiresIn: '3d' });
};

// login a user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token: string = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// signup a user
const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await User.signup(email, password);

    // create a token
    const token: string = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export { signupUser, loginUser };