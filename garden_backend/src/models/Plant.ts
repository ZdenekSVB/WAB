import mongoose, { Document, Schema } from "mongoose";

export interface IPlant extends Document {
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    createdBy: mongoose.Types.ObjectId;
}

const plantSchema: Schema<IPlant> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IPlant>("Plant", plantSchema);
