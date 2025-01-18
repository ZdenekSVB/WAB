import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Import express-session a Keycloak
import session from "express-session";
import { keycloak, memoryStore } from "./config/keycloak";

// Import Swagger konfigurace
import { setupSwagger } from "./config/swagger";

// Načtení konfigurace
dotenv.config();

// Inicializace aplikace
const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Nastavte správnou URL pro frontend
        credentials: true, // Podporuje cookies, důležité pro session
    },
});

// Middleware pro body
app.use(express.json());

// Konfigurace CORS pro umožnění komunikace mezi backendem a frontendem
app.use(cors({
    origin: "http://localhost:8081",  // Nastavte URL, kde běží váš frontend (Vue.js)
    credentials: true,               // Umožňuje sdílení cookies
}));

// Konfigurace session pro Keycloak
app.use(
    session({
        secret: 'your-session-secret', // Tajný klíč pro session
        resave: false,
        saveUninitialized: true,
        store: memoryStore, // Použití paměťového úložiště pro session
    })
);

// Inicializace Keycloak middleware pro autentizaci
app.use(keycloak.middleware());

// Inicializace Swagger dokumentace
setupSwagger(app);

// Socket.IO události
io.on("connection", (socket) => {
    console.log("Uživatel připojen");

    // Posílání aktualizací tipů
    socket.on("newTip", (tip) => {
        io.emit("tipUpdate", tip);
    });

    socket.on("disconnect", () => {
        console.log("Uživatel odpojen");
    });
});

// Import cest
import authRoutes from "./routes/auth";
import plantRoutes from "./routes/plants";
import tipRoutes from "./routes/tips";

// Cesty s Keycloak ochranou
app.use("/auth", authRoutes);
app.use("/plants", keycloak.protect(), plantRoutes);  // Ochrana pro plants
app.use("/tips", keycloak.protect(), tipRoutes);      // Ochrana pro tips

// Připojení k MongoDB
mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log("Připojeno k databázi"))
    .catch((err) => {
        console.error("Chyba při připojení k databázi:", err);
        process.exit(1);
    });

// Spuštění serveru
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
