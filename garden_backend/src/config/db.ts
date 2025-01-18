import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Odstranění zbytečných možností
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB připojeno");
    } catch (error) {
        console.error("Chyba při připojení k MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
