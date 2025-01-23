import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import Plant from './plantModel';
import logger from '../services/loggingService';

const Schema = mongoose.Schema;

// Utility function to log model initialization
const logModelInitialization = (modelName: string) => {
  logger.info(`${modelName} model initialized`);
};

// Utility function to validate user input
const validateUserInput = (email: string, password: string) => {
  if (!email || !password) {
    logger.warn('Missing required fields: email or password');
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    logger.warn(`Invalid email format: ${email}`);
    throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password, { minLength: 6 })) {
    logger.warn('Weak password provided');
    throw Error('Password must be at least 6 characters long');
  }
};

// Definice rozhraní pro uživatele
interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  token?: string;
}

// Rozšíření modelu uživatele o statické metody
interface UserModel extends Model<IUser> {
  signup(
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
      nickname?: string
  ): Promise<IUser>;
  login(email: string, password: string): Promise<{ user: IUser; token: string }>;
  deleteUser(userId: string): Promise<void>;
}

// Schéma pro uživatele
const userSchema = new mongoose.Schema<IUser>(
    {
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
      firstName: {
        type: String,
        required: false,
      },
      lastName: {
        type: String,
        required: false,
      },
      nickname: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
);

// Statická metoda pro registraci
userSchema.statics.signup = async function (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    nickname?: string
): Promise<IUser> {
  validateUserInput(email, password);

  const exists = await this.findOne({ email });
  if (exists) {
    logger.warn(`Email already in use: ${email}`);
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, firstName, lastName, nickname });
  logger.info(`User registered: ${user.email}`);
  return user;
};

// Statická metoda pro přihlášení
userSchema.statics.login = async function (
    email: string,
    password: string
): Promise<{ user: IUser; token: string }> {
  validateUserInput(email, password);

  const user = await this.findOne({ email });
  if (!user) {
    logger.warn(`User not found: ${email}`);
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    logger.warn(`Invalid password attempt for user: ${user.email}`);
    throw Error('Incorrect password');
  }

  const token = jwt.sign({ _id: user._id }, process.env.SECRET as string, { expiresIn: '3d' });
  logger.info(`User logged in: ${user.email}`);
  return { user, token };
};

// Statická metoda pro smazání uživatele
userSchema.statics.deleteUser = async function (userId: string): Promise<void> {
  const user = await this.findById(userId);
  if (!user) {
    logger.warn(`User not found: ${userId}`);
    throw Error('User not found');
  }

  // Smazání všech rostlin uživatele
  await Plant.deleteMany({ user_id: userId });

  // Smazání uživatele
  await this.deleteOne({ _id: userId });
  logger.info(`User deleted: ${userId}`);
};

// Model pro uživatele
const User = mongoose.model<IUser, UserModel>('User', userSchema);

// Logování inicializace modelu
logModelInitialization('User');

export default User;