import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { resetTestDb } from "./setup";
import db from '../config/db';

const app = createApp();

beforeAll(async () => {
    await resetTestDb();
});

describe('GET /api/venues', async () => {
    it('should exist and return 200 status', async () => {
        const res = await request(app).get('/api/venues');
        expect(res.status).toBe(200);
    });

    it('should return 404 if route is invalid', async () => {
        const res = await request(app).get('/api/venuess');
        expect(res.status).toBe(404);
    });

    it('should return an array of venues', async () => {
        const res = await request(app).get('/api/venues');
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 5 venues', async () => {
        const res = await request(app).get('/api/venues');
        expect(res.body.length).toBe(5);
    });
});

describe('GET /api/venues/:id', () => {
    it('should return a single venue', async () => {
        const res = await request(app).get('/api/venues/1');
        expect(res.body.id).toBe(1);
        expect(res.body.id).not.toBe(2);
    });

    it('should return 404 for missing id', async () => {
        const res = await request(app).get('/api/venues/66');
        expect(res.status).toBe(404);
    });

    it('should return 400 for bad id', async () => {
        const res = await request(app).get('/api/venues/abc');
        expect(res.status).toBe(400);
    });
});

describe('GET /api/venues/:id/events', () => {
    it('should should return 200 status if route is valid', async () => {
        const res = await request(app).get('/api/venues/3/events');
        expect(res.status).toBe(200);
    });

    it('should return 404 if route is invalid', async () => {
        const res = await request(app).get('/api/venues/3/eventssssss');
        expect(res.status).toBe(404);
    });

    it('should return 400 status if venue id is not valid', async () => {
        const res = await request(app).get('/api/venues/abc/events');
        expect(res.status).toBe(400);
    });
    
    it('should return events for correct venue id', async () => {
        const res = await request(app).get('/api/venues/3/events');
        expect(res.body.venue.id).toBe(3);
        expect(res.body.venue.id).not.toBe(2);
    });
    
    it('should return an array of events', async () => {
        const res = await request(app).get('/api/venues/3/events');
        expect(Array.isArray(res.body.events)).toBe(true);
    });
});