import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";

const app = createApp();

describe('GET /api/events', async () => {
    it('should get a list of all events', async () => {
        const res = await request(app).get('/api/events');
        expect(res.status).toBe(200);
        expect(res.body.count).toBeGreaterThan(0);
    })
})

// skoða tima 9 seinni hluta með coverage!

// npm run test - til að fá eitt run í gegn
// npm run testing - til að fá continous test