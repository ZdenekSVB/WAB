import winston from 'winston';
import path from 'path';

// Definice logovacích úrovní
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
    },
};

// Konfigurace Winston loggeru
const logger = winston.createLogger({
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Přidá časovou značku
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`; // Formát logu
        })
    ),
    transports: [
        // Logování do konzole (barevné)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Barevné zvýraznění
                winston.format.simple()
            ),
        }),
        // Logování do souboru (pouze info a vyšší úrovně)
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/app.log'),
            level: 'info',
        }),
        // Logování chyb do samostatného souboru
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
        }),
    ],
});

// Přidání barev pro logování v konzoli
winston.addColors(logLevels.colors);

export default logger;