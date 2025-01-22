import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

interface IPlant extends Document {
  name: string;
  species: string;
  wateringFrequency: number;
  imageUrl?: string; // Base64 řetězec
  user_id: string;
}

const plantSchema: MongooseSchema<IPlant> = new MongooseSchema({
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
    type: String, // Base64 řetězec
    required: false,
  },
  user_id: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model<IPlant>('Plant', plantSchema);