import mongoose, { Document, Schema } from "mongoose";

export interface ITip extends Document {
    title: string;
    content: string;
    createdBy: mongoose.Types.ObjectId;
}

const tipSchema: Schema<ITip> = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITip>("Tip", tipSchema);
