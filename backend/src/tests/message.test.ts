import request from 'supertest';
import { app } from '@/server';
import mongoose from 'mongoose';
import Message from '@/models/messageModel';

describe('Message Endpoints', () => {
    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect(process.env.MONGO_URI || '');
    });

    afterAll(async () => {
        // Clean up and disconnect
        await Message.deleteMany({});
        await mongoose.connection.close();
    });

    it('should fetch all messages', async () => {
        // Create a test message
        await Message.create({
            user: 'testuser',
            text: 'This is a test message',
        });

        const res = await request(app).get('/api/messages');

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].user).toBe('testuser');
        expect(res.body[0].text).toBe('This is a test message');
    });

    it('should return an empty array if no messages exist', async () => {
        // Clear all messages
        await Message.deleteMany({});

        const res = await request(app).get('/api/messages');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});