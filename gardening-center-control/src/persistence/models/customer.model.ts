import * as mongoose from "mongoose";

export const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        loyaltyPoints: { type: Number, default: 0 },
        orders: [
            {
                orderId: { type: mongoose.Types.ObjectId, ref: "Order", required: true },
                status: { type: String, required: true }, // Stores the order status for quick access
            },
        ],
    })
);
