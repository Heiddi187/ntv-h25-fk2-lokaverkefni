import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { resetTestDb } from "./setup";
import db from '../config/db';

const app = createApp();

beforeAll(async () => {
    await resetTestDb();
});

describe('GET /api/events', () => {

    it('should return a 200 status', async () => {
        const res = await request(app).get('/api/events');
        expect(res.status).toBe(200);
        expect(res.body.count).toBeGreaterThan(0);
    });

    it('should return a count', async () => {
        const res = await request(app).get('/api/events');
        expect(res.body).toHaveProperty('count');
        expect(res.body.count).toBe(res.body.items.length);
    })

    it('should return an array of items', async () => {
        const res = await request(app).get('/api/events');
        expect(Array.isArray(res.body.items)).toBe(true);
    })

    it('should have a length of 20+ (seed data has 20)', async () => {
        const res = await request(app).get('/api/events');
        expect(res.body.items.length).toBeGreaterThanOrEqual(20);
    })

})

// til að fá tóman lista - put/patch deleteAllEvents /// finna út seinna
//   it('returns empty list when no events exist', async () => {
//     await db.none('DELETE FROM events');

//     const res = await request(app).???('/api/events');

//     expect(res.body.items).toEqual([]);
//     expect(res.body.count).toBe(0);
//   });



// skoða tima 9 seinni hluta með coverage!

// npm run test - til að fá eitt run í gegn
// npm run testing - til að fá continous test