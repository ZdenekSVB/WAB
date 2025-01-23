import request from 'supertest';
import app from './setup';
import Message from '../models/messageModel';

describe('Message Routes', () => {
    it('should fetch all messages', async () => {
        // Add a test message to the database
        await Message.create({ user: 'testUser', text: 'Hello, world!' });

        const response = await request(app).get('/api/messages');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].text).toBe('Hello, world!');
    });
});