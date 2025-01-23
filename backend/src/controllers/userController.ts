import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.SECRET as string, { expiresIn: '3d' });
};

// login a user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const { user, token } = await User.login(email, password);
    res.status(200).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// signup a user
const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await User.signup(email, password);
    const token: string = createToken(user._id);
    res.status(200).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// update a user
const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { password } = req.body; // Přijímáme pouze heslo

  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Aktualizujeme pouze heslo
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Vracíme pouze token (pokud se změní)
    const token = jwt.sign({ _id: user._id }, process.env.SECRET as string, { expiresIn: '3d' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// delete a user
const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    await User.deleteUser(req.user._id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export { signupUser, loginUser, updateUser, deleteUser }; // Přidejte deleteUser do exportu