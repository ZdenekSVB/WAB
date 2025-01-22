import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

interface IMessage extends Document {
    user: string; // Uživatel, který zprávu odeslal
    text: string; // Text zprávy
    createdAt: Date; // Datum vytvoření zprávy
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
        default: Date.now,
    },
});

export default mongoose.model<IMessage>('Message', messageSchema);