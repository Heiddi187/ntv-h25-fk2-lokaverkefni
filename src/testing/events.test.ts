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

});

const validTestEvent = {
    title: "tester event",
    description: "some description",
	event_date: "2026-01-03",
	event_time: "19:15",
	duration: 69,
	city: "Reykjavík",
	venue_id: 4,
	category: "test",
	price: 123,
	tix_available: 50 
}

describe('POST /api/events', () => {

    it('should create a new event and return status 201', async () => {
        const res = await request(app).post('/api/events').send(validTestEvent);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('title');
        expect(res.body.city).toBe(validTestEvent.city);
    })

    it('should add new event to the database', async () => {
        const res = await request(app).post('/api/events').send(validTestEvent);
        const newEvent = await db.one('SELECT * FROM events WHERE id=$1', [res.body.id]);
        expect(newEvent.title).toBe(validTestEvent.title);
    })

    it('should reject if there are missing fields', async () => {
        const res = await request(app).post('/api/events').send({
            title: "tester event",
            description: "some description",
            event_date: "2026-01-03",
            //event_time: "19:15",
            duration: 69,
            city: "Reykjavík",
            venue_id: 4,
            category: "test",
            price: 123,
            tix_available: 50
        });
        expect(res.status).toBe(400);
    })

    it('should reject if there are invalid types fields', async () => {
        const res = await request(app).post('/api/events').send({
            title: "tester event",
            description: "some description",
            event_date: "2026-01-03",
            event_time: "19:15",
            duration: "69", // should be number not string
            city: "Reykjavík",
            venue_id: 4,
            category: "test",
            price: 123,
            tix_available: 50
        });
        expect(res.status).toBe(400);
    })

    it('should reject if venue_id does not exist', async () => {
        const res = await request(app).post('/api/events').send({
            title: "tester event",
            description: "some description",
            event_date: "2026-01-03",
            event_time: "19:15",
            duration: 69, 
            city: "Reykjavík",
            venue_id: 4000,
            category: "test",
            price: 123,
            tix_available: 50
        });
        expect(res.status).toBe(500);
    })

    it.todo('stest1', async () => {

    })
});

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