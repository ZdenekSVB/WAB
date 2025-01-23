import request from 'supertest';
import { app } from '@/server';
import mongoose from 'mongoose';
import Plant from '@/models/plantModel';
import { createToken } from '@/controllers/userController';

// Mock the requireAuth middleware
jest.mock('@/middleware/requireAuth', () => (req: any, res: any, next: any) => {
    req.user = { _id: 'testUserId' }; // Mock the user object
    next();
});

describe('Plant Endpoints', () => {
    let token: string;
    let plantId: string;
    const testUserId = new mongoose.Types.ObjectId().toString();

    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect(process.env.MONGO_URI || '');

        // Create a test user and generate a token
        token = createToken(testUserId);
        console.log('Generated Token:', token); // Log the token for debugging
    });

    afterAll(async () => {
        // Clean up and disconnect
        await Plant.deleteMany({});
        await mongoose.connection.close();
    });

    it('should create a new plant', async () => {
        const res = await request(app)
            .post('/api/plants')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Plant',
                species: 'Test Species',
                wateringFrequency: 7,
                imageUrl: 'http://example.com/image.jpg',
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        plantId = res.body._id;
    }, 30000);

    it('should get a plant by ID', async () => {
        const res = await request(app)
            .get(`/api/plants/${plantId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body._id).toBe(plantId);
    }, 30000);

    it('should update a plant', async () => {
        const res = await request(app)
            .patch(`/api/plants/${plantId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated Plant Name' });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Plant Name');
    }, 30000);

    it('should delete a plant', async () => {
        const res = await request(app)
            .delete(`/api/plants/${plantId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body._id).toBe(plantId);
    }, 30000);
});