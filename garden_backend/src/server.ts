import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Načtení konfigurace
dotenv.config();

// Inicializace aplikace
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import cest
import authRoutes from "./routes/auth";
import plantRoutes from "./routes/plants";
import tipRoutes from "./routes/tips";

// Základní endpointy
app.use("/auth", authRoutes);
app.use("/plants", plantRoutes);
app.use("/tips", tipRoutes);

// Připojení k MongoDB (odstraněny zbytečné možnosti)
mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log("Připojeno k databázi"))
    .catch((err) => {
        console.error("Chyba při připojení k databázi:", err);
        process.exit(1); // Ukončí server, pokud se nepodaří připojit k databázi
    });

// Spuštění serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
