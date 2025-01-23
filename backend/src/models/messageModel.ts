import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import logger from '../services/loggingService';

// Utility function to log model initialization
const logModelInitialization = (modelName: string) => {
    logger.info(`${modelName} model initialized`);
};

// Definice rozhraní pro zprávu
interface IMessage extends Document {
    user: string;
    text: string;
    createdAt: Date;
}

// Schéma pro zprávu
const messageSchema: MongooseSchema<IMessage> = new MongooseSchema({
    user: {
        type: String,
        required: [true, 'User is required'], // Validace s chybovou zprávou
    },
    text: {
        type: String,
        required: [true, 'Text is required'], // Validace s chybovou zprávou
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automaticky přidá čas při vytvoření
    },
});

// Model pro zprávu
const Message = mongoose.model<IMessage>('Message', messageSchema);

// Logování inicializace modelu
logModelInitialization('Message');

export default Message;