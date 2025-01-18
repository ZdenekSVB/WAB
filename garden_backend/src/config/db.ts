import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB připojeno");
    } catch (error) {
        console.error("Chyba při připojení k MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
