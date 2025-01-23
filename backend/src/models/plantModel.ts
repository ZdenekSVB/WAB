import mongoose, { Document } from 'mongoose';
import logger from '../services/loggingService';

// Utility function to log model initialization
const logModelInitialization = (modelName: string) => {
  logger.info(`${modelName} model initialized`);
};

// Definice rozhraní pro rostlinu
interface IPlant extends Document {
  name: string;
  species: string;
  wateringFrequency: number;
  imageUrl?: string;
  user_id: string;
  likes: number;
  likedBy: string[];
}

// Schéma pro rostlinu
const plantSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required'], // Validace s chybovou zprávou
      },
      species: {
        type: String,
        required: [true, 'Species is required'], // Validace s chybovou zprávou
      },
      wateringFrequency: {
        type: Number,
        required: [true, 'Watering frequency is required'], // Validace s chybovou zprávou
      },
      imageUrl: {
        type: String,
        required: false,
      },
      user_id: {
        type: String,
        required: [true, 'User ID is required'], // Validace s chybovou zprávou
      },
      likes: {
        type: Number,
        default: 0,
      },
      likedBy: {
        type: [String], // Ukládáme emaily uživatelů
        default: [],
      },
    },
    { timestamps: true } // Automaticky přidá createdAt a updatedAt
);

// Model pro rostlinu
const Plant = mongoose.model<IPlant>('Plant', plantSchema);

// Logování inicializace modelu
logModelInitialization('Plant');

export default Plant;