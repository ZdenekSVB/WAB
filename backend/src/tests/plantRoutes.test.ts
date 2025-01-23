import request from 'supertest';
import app from './setup';
import Plant from '../models/plantModel';
import User from '../models/userModel';

describe('Plant Routes', () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        // Register and login a user to get a token
        const userResponse = await request(app)
            .post('/api/user/signup')
            .send({
                email: 'test@example.com',
                password: 'Password123!', // Strong password
                firstName: 'John',
                lastName: 'Doe',
                nickname: 'johndoe',
            });

        token = userResponse.body.token;
        userId = userResponse.body._id;
    });

    it('should create a new plant', async () => {
        const token = 'your-valid-token'; // Replace with a valid token
        const response = await request(app)
            .post('/api/plants')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rose',
                user_id: 'your-user-id', // Replace with a valid user ID
            });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Rose');
        expect(response.body.user_id).toBe('your-user-id');
    });

    it('should fetch plants for the logged-in user', async () => {
        // Create a test plant
        await request(app)
            .post('/api/plants')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rose',
                species: 'Flower',
                wateringFrequency: 3,
                imageUrl: 'https://example.com/rose.jpg',
            });

        const response = await request(app)
            .get('/api/plants/my-plants')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Rose');
    });
});