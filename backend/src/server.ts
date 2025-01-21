import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Načtení proměnných prostředí
dotenv.config();

const app = express();

// Middleware pro zpracování JSON
app.use(express.json());

// Nastavení mongoose strictQuery
mongoose.set('strictQuery', true);

// Připojení k databázi
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('Chyba: MONGO_URI není nastavena v .env souboru');
    process.exit(1); // Ukončí aplikaci, pokud není URI dostupná
}

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log('Připojeno k databázi');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server běží na portu ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.error('Chyba při připojení k databázi:', err.message);
    });
