import * as mongoose from "mongoose";

// Order Status Enum for gardening
export enum OrderStatus {
    pending = "pending",
    completed = "completed",
    shipped = "shipped",
}

export const Order = mongoose.model(
    "Order",
    new mongoose.Schema({
        customerId: { type: mongoose.Types.ObjectId, ref: "Customer", required: true },
        items: [
            {
                plantId: { type: mongoose.Types.ObjectId, ref: "Plant", required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        status: { type: String, enum: Object.values(OrderStatus), required: true },
        totalPrice: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
    })
);
