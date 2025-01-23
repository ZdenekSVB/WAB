import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Utility function to define reusable schemas
const getSwaggerSchemas = () => ({
    Plant: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            species: { type: 'string' },
            wateringFrequency: { type: 'number' },
            imageUrl: { type: 'string' },
            user_id: { type: 'string' },
            likes: { type: 'number' },
            likedBy: {
                type: 'array',
                items: { type: 'string' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    PlantInput: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            species: { type: 'string' },
            wateringFrequency: { type: 'number' },
            imageUrl: { type: 'string' },
        },
        required: ['name', 'species', 'wateringFrequency'],
    },
    Message: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            text: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
});

// Utility function to define Swagger options
const getSwaggerOptions = () => ({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Garden Buddy API',
            version: '1.0.0',
            description: 'API documentation for the Garden Buddy application',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: getSwaggerSchemas(), // Reuse schemas
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(getSwaggerOptions());

// Setup Swagger middleware
export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};