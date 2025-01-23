import request from 'supertest';
import app from '../../src/server'; // Correct path to server.ts
import mongoose from 'mongoose';
import User from '../../src/models/userModel'; // Correct path to userModel.ts
import logger from '../../src/services/loggingService'; // Correct path to loggingService.ts

describe('User Routes', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.TEST_MONGO_URI as string);
    });

    afterAll(async () => {
        // Clean up the database
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/user/signup') // Use /signup instead of /register
            .send({
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                nickname: 'johndoe',
            });
        expect(response.status).toBe(200);
        expect(response.body.email).toBe('test@example.com');
        expect(response.body.token).toBeDefined();
    });

    // Other tests...
});