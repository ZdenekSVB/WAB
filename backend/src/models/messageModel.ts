import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

interface IMessage extends Document {
    user: string;
    text: string;
    createdAt: Date; // Přidej pole pro čas
}

const messageSchema: MongooseSchema<IMessage> = new MongooseSchema({
    user: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automaticky přidá čas při vytvoření
    },
});

export default mongoose.model<IMessage>('Message', messageSchema);