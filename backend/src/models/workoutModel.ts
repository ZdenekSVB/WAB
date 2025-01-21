import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

interface IWorkout extends Document {
  title: string;
  reps: number;
  load: number;
  user_id: string;
}

const workoutSchema: MongooseSchema<IWorkout> = new MongooseSchema({
  title: {
    type: String,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  load: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<IWorkout>('Workout', workoutSchema);