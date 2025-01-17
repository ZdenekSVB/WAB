import {beforeEach, describe, expect, it} from "vitest";
import request from "../request";
import {User} from "../../src/persistence/models/customer.model";
import {Flight} from "../../src/persistence/models/order.model";
import {Types} from "mongoose";

describe('POST /flights/:id/reservations', () => {
    beforeEach(async () => {
        await new User({ _id: new Types.ObjectId('b10000000000000000000000'), name: 'John Doe', email: '', password: '' }).save();
        await new Flight({
            _id: new Types.ObjectId('f10000000000000000000000'),
            flightNumber: 'OK123',
            aircraftId: new Types.ObjectId('a10000000000000000000000'),
            departure: {
                airport: 'SFO',
                city: 'San Francisco',
                time: new Date(),
            },
            arrival: {
                airport: 'LAX',
                city: 'Los Angeles',
                time: new Date(),
            },
            durationMinutes: 60,
            reservations: [],
        }).save()
    });

    it('returns 201 for valid data', async () => {
        const res = await request
            .post(`/flights/f10000000000000000000000/reservations`)
            .send({
                userId: 'b10000000000000000000000',
                seatNumber: '1A',
            })
        console.log(res.body)
        expect(res.status).toBe(201);
    });

    it('returns 400 for invalid query', async () => {
        const res = await request
            .post(`/flights/f10000000000000000000000/reservations`)
            .send({
                userId: 'b10000000000000000000000',
                seatNumber: '',
            })
        console.log(res.body)
        expect(res.status).toBe(400);
    });

    it('returns 404 if user not found', async () => {
        const res = await request
            .post(`/flights/f10000000000000000000000/reservations`)
            .send({
                userId: 'b20000000000000000000000',
                seatNumber: '1A',
            })
        console.log(res.body)
        expect(res.status).toBe(404);
    });

    it('returns 404 if flight not found', async () => {
        const res = await request
            .post(`/flights/f20000000000000000000000/reservations`)
            .send({
                userId: 'b10000000000000000000000',
                seatNumber: '1A',
            })
        console.log(res.body)
        expect(res.status).toBe(404);
    });

    it('returns 409 if seat already booked', async () => {
        const res1 = await request
            .post(`/flights/f10000000000000000000000/reservations`)
            .send({
                userId: 'b10000000000000000000000',
                seatNumber: '1A',
            })
        console.log(res1.body)
        expect(res1.status).toBe(201);

        const res2 = await request
            .post(`/flights/f10000000000000000000000/reservations`)
            .send({
                userId: 'b10000000000000000000000',
                seatNumber: '1A',
            })
        console.log(res2.body)
        expect(res2.status).toBe(409);
    });

});