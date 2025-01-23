import request from 'supertest';
import app from './setup'; // Import the app from setup.ts
import User from '../models/userModel';

describe('User Routes', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/user/signup')
            .send({
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe',
                nickname: 'johndoe',
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('test@example.com');
        expect(response.body.token).toBeDefined();
    });
});