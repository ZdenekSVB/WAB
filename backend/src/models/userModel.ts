import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import Plant from './plantModel'; // Importujte model Plant

const Schema = mongoose.Schema;

interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  token?: string;
}

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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false, // Nepovinné
  },
  lastName: {
    type: String,
    required: false, // Nepovinné
  },
  nickname: {
    type: String,
    required: false, // Nepovinné
  },
}, { timestamps: true });

// Statická metoda pro registraci
userSchema.statics.signup = async function(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    nickname?: string
): Promise<IUser> {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, firstName, lastName, nickname });
  return user;
};

// Statická metoda pro přihlášení
userSchema.statics.login = async function(
    email: string,
    password: string
): Promise<{ user: IUser; token: string }> {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  const token = jwt.sign({ _id: user._id }, process.env.SECRET as string, { expiresIn: '3d' });
  return { user, token };
};

// Statická metoda pro smazání uživatele
userSchema.statics.deleteUser = async function(userId: string): Promise<void> {
  const user = await this.findById(userId);
  if (!user) {
    throw Error('User not found');
  }

  // Smazání všech rostlin uživatele
  await Plant.deleteMany({ user_id: userId });

  // Smazání uživatele
  await this.deleteOne({ _id: userId });
};

export default mongoose.model<IUser, UserModel>('User', userSchema);