import * as mongoose from "mongoose";

// Plant Location interface
export interface PlantLocation {
    aisle: string;
    shelf: string;
    row: number;
    position: number;
}

// Plant model
export const Plant = mongoose.model(
    "Plant",
    new mongoose.Schema({
        name: { type: String, required: true },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        quantityInStock: { type: Number, required: true },
        description: { type: String },
        location: {
            aisle: { type: String },
            shelf: { type: String },
            row: { type: Number },
            position: { type: Number }
        },
        createdAt: { type: Date, default: Date.now },
    })
);
