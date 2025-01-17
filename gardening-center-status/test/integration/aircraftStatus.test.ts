import {beforeEach, describe, expect, it} from "vitest";
import request from "../request";

describe('POST /aircrafts/:id/status', () => {
    beforeEach(async () => {
        // No data for these tests
    });

    it('returns 201 for valid data', async () => {
        const timestamp = Date.now();
        const res = await request
            .post(`/aircrafts/a00000000000000000000001/status`)
            .send({
                latitude: 1,
                longitude: 2,
            })
        console.log(res.body)
        expect(res.status).toBe(201);
        expect(res.body.aircraftId).toBe('a00000000000000000000001');
        expect(res.body.latitude).toBe(1);
        expect(res.body.longitude).toBe(2);
        expect(Date.parse(res.body.timestamp)).toBeGreaterThanOrEqual(timestamp);
    });

    it('should 400 for invalid aircraftId', async () => {
        const res = await request
            .post(`/aircrafts/aaa/status`)
            .send({
                latitude: 1,
                longitude: 2,
            })
        console.log(res.body)
        expect(res.status).toBe(400);
    });

    it('returns 400 for invalid latitude', async () => {
        const res = await request
            .post(`/aircrafts/a00000000000000000000001/status`)
            .send({
                latitude: -91,
                longitude: 2,
            })
        console.log(res.body)
        expect(res.status).toBe(400);
    });

    it('should 400 for invalid longitude', async () => {
        const res = await request
            .post(`/aircrafts/a00000000000000000000001/status`)
            .send({
                latitude: 1,
                longitude: -200,
            })
        console.log(res.body)
        expect(res.status).toBe(400);
    });

});