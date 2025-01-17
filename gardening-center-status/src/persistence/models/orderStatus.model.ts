// OrderStatus.model.ts
import * as mongoose from "mongoose";

export const OrderStatus = mongoose.model('OrderStatus', new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, required: true },
}));
