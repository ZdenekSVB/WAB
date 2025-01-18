import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

// Swagger konfigurace
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Garden API",
            version: "1.0.0",
            description: "API dokumentace pro Garden backend",
        },
        servers: [
            {
                url: "http://localhost:5000", // Backend URL
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // Cesty k vašim route souborům
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Application): void => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
