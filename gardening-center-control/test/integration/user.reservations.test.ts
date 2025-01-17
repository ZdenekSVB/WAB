import {beforeEach, describe, expect, it} from "vitest";
import {User} from "../../src/persistence/models/customer.model";
import {Types} from "mongoose";
import request, {authorizedRequest, login} from "../request";

describe('GET /users/me/reservations', () => {
    beforeEach(async () => {
        const user = new User({name: 'John Doe', email: 'johndoe@example.com', password: ''});
        user.reservations.push({
            flightId: new Types.ObjectId('f00000000000000000000001'),
            seatNumber: 'A1',
            status: 'confirmed',
            bookingTime: new Date('2024-10-01T10:00:00.000Z')
        });
        await user.save();
    });

    it('returns 200 and user reservations if user is logged in and exists in mongo', async () => {
        await login('johndoe')
        const res = await authorizedRequest.get('/users/me/reservations')
        console.log(res.body)
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].flightId).toBe('f00000000000000000000001');
        expect(res.body[0].seatNumber).toBe('A1');
        expect(res.body[0].status).toBe('confirmed');
        expect(res.body[0].bookingTime).toBe('2024-10-01T10:00:00.000Z');
    });

    it('returns 404 if user is logged in but is not found in mongo', async () => {
        await login('officer1')
        const res = await authorizedRequest.get('/users/me/reservations')
        console.log(res.body)
        expect(res.status).toBe(404);
    });

    it('returns 401 if user is not logged in', async () => {
        const res = await request.get('/users/me/reservations')
        console.log(res.body)
        expect(res.status).toBe(401);
    });

});