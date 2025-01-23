import mongoose, { Document, } from 'mongoose';

interface IPlant extends Document {
  name: string;
  species: string;
  wateringFrequency: number;
  imageUrl?: string;
  user_id: string;
  likes: number;
  likedBy: string[];
}

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  wateringFrequency: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  user_id: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [String], // Ukládáme emaily uživatelů
    default: [],
  },
}, { timestamps: true });

export default mongoose.model<IPlant>('Plant', plantSchema);