import request from 'supertest';
import { app } from '@/server';
import mongoose from 'mongoose';
import User from '@/models/userModel';
import { createToken } from '@/controllers/userController';

describe('requireAuth Middleware', () => {
    let token: string;
    let testUserId: string;

    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect(process.env.MONGO_URI || '');

        // Create a test user
        const user = await User.create({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            nickname: 'testuser',
        });

        // Generate a token for the test user
        testUserId = user._id.toString();
        token = createToken(testUserId);
        console.log('Generated Token:', token); // Log the token for debugging
    });

    afterAll(async () => {
        // Clean up and disconnect
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should reject requests without an authorization header', async () => {
        const res = await request(app)
            .put('/api/user/update')
            .send({ password: 'newpassword123' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Authorization token required');
    });

    it('should reject requests with an invalid token format', async () => {
        const res = await request(app)
            .put('/api/user/update')
            .set('Authorization', 'InvalidTokenFormat')
            .send({ password: 'newpassword123' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Invalid token format');
    });

    it('should reject requests with an invalid token', async () => {
        const res = await request(app)
            .put('/api/user/update')
            .set('Authorization', 'Bearer invalidtoken')
            .send({ password: 'newpassword123' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Request is not authorized');
    });

    it('should reject requests for a non-existent user', async () => {
        const invalidUserId = new mongoose.Types.ObjectId().toString();
        const invalidToken = createToken(invalidUserId);

        const res = await request(app)
            .put('/api/user/update')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send({ password: 'newpassword123' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('User not found');
    });

    it('should allow requests with a valid token', async () => {
        const res = await request(app)
            .put('/api/user/update')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'newpassword123' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});