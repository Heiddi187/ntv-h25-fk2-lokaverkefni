import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { resetTestDb } from "./setup";
import db from '../config/db';

const app = createApp();

beforeAll(async () => {
    await resetTestDb();
});

describe('Route validation', () => {
    it('GET /api/events exists', async () => {
        const res = await request(app).get('/api/events');
        expect(res.status).toBe(200); 
    });

    it('GET invalid route returns 404', async () => {
        const res = await request(app).get('/api/event');
        expect(res.status).toBe(404); 
    });

    it('POST /api/events exists', async () => {
        const res = await request(app).get('/api/events').send({});
        expect(res.status).toBe(200); 
    });

    it('POST invalid route returns 404', async () => {
        const res = await request(app).get('/api/eventzz').send({});
        expect(res.status).toBe(404); 
    });
})

describe('GET /api/events', () => {
    it('should return a 200 status', async () => {
        const res = await request(app).get('/api/events');
        expect(res.status).toBe(200);
        expect(res.body.total).toBeGreaterThan(0);
    });

    it('should return a count', async () => {
        const res = await request(app).get('/api/events');
        expect(res.body).toHaveProperty('total');
        expect(res.body.events.length).toBeGreaterThanOrEqual(20);
    })

    it('should return an array of events', async () => {
        const res = await request(app).get('/api/events');
        expect(Array.isArray(res.body.events)).toBe(true);
    })

    it('should have a length of 15+ (seed data has 20+)', async () => {
        const res = await request(app).get('/api/events');
        expect(res.body.events.length).toBeGreaterThanOrEqual(20);
    })

    it('should return empty list if no events match filters', async () => {
        const res = await request(app)
            .get('/api/events')
            .query({ category: 'nonexistent' });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.events)).toBe(true);
        expect(res.body.events.length).toBe(0);
    });

    it('should reject invalid sorting value', async () => {
        const res = await request(app).get('/api/events').query({ sort: 'Invalid filter' });
        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Validation failed');
    })

    it('should reject if page is less then 1', async () => {
        const res = await request(app).get('/api/events').query({ page: 0 });
        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Validation failed');
    });

    it('should pagenate results', async () => {
        const res = await request(app).get('/api/events').query({ page: 1, limit: 5 });
        expect(res.status).toBe(200);
        expect(res.body.events.length).toBeLessThanOrEqual(5);
    });

    it('should return different results for different pages', async () => {
        const page1 = await request(app).get('/api/events').query({ page: 1, limit: 5 });
        const page2 = await request(app).get('/api/events').query({ page: 2, limit: 5 });
        expect(page1.body.events[0].id).not.toBe(page2.body.events[0].id);
    });

    it('should filter events with date_from', async () => {
        const res = await request(app).get('/api/events').query({ date_from: '2026-03-03' });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.events)).toBe(true);
        for (const event of res.body.events) {
            expect(new Date(event.event_date) >= new Date('2026-03-03')).toBe(true);
        }
    });

    it('should filter events with date_to', async () => {
        const res = await request(app).get('/api/events').query({ date_to: '2026-03-03' });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.events)).toBe(true);
        for (const event of res.body.events) {
            expect(new Date(event.event_date) <= new Date('2026-03-03')).toBe(true);
        }
    });

    it('should reject invalid date format', async () => {
        const res = await request(app).get('/api/events').query({ date_from: 'þriðjimarstuttuguogsex' });
        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Validation failed');
    });

    it('should work with multiple filters', async () => {
        const res = await request(app).get('/api/events').query({ category: 'sport', city: 'Reykjavík' });
        expect(res.status).toBe(200);
        for (const event of res.body.events) {
            expect(event.category).toContain('Sport');
            expect(event.city).toContain('Reykjavík');
        }
    });

    it('should return total count > page limit', async () => {
        const res = await request(app).get('/api/events').query({ category: 'sport', limit: 2 });
        expect(res.status).toBe(200);
        expect(res.body.total).toBeGreaterThan(res.body.events.length);
        expect(typeof res.body.total).toBe('number');
    });

    it('should return empty list when no event matches filters', async () => {
        const res = await request(app).get('/api/events').query({ category: 'webinar' });
        expect(res.status).toBe(200);
        expect(res.body.events).toEqual([]);
        expect(res.body.total).toBe(0);
    });
});

describe('GET /api/events/:id', () => {
    it('should return a event by id', async () => {
        const res = await request(app).get('/api/events/5');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(5);
    });

    it('should return 404 for missing id', async () => {
        const res = await request(app).get('/api/events/5000');
        expect(res.status).toBe(404);
    });

    it('should return 400 for bad id', async () => {
        const res = await request(app).get('/api/events/abc');
        expect(res.status).toBe(400);
    });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// drasl sem ég var að leika mér með


/*
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
});
*/

/*
describe('PATCH /api/events/:id', () => {
    it('should update a single field', async () => {
        const res = await request(app).patch('/api/events/20').send({ price: 500 });
        expect(res.body.price).toBe(500);
    })

    it('should return 200 on successful change', async () => {
        const res = await request(app).patch('/api/events/20').send({ price: 500 });
        expect(res.status).toBe(200);
    })

    it('should update a multiple fields', async () => {
        const res = await request(app).patch('/api/events/20').send({ price: 500, category: "cat changed" });
        expect(res.body.price).toBe(500);
        expect(res.body.category).toBe("cat changed")
    })

    it('should call changed event from database with updated field', async () => {
        const res = await request(app).patch('/api/events/20').send({ category: "cat changed" });
        const updatedEvent = await db.one('SELECT category FROM events WHERE id=20');
        expect(updatedEvent.category).toBe("cat changed");
    })

    it('should reject invalid data type', async () => {
        const res = await request(app).patch('/api/events/20').send({ price: "500" });
        expect(res.status).toBe(400);
    })

    it('should reject if field does not exist', async () => {
        const res = await request(app).patch('/api/events/20').send({ cost: 500 });
        expect(res.status).toBe(400);
    })

    it('should return 404 status if event does not exist', async () => {
        const res = await request(app).patch('/api/events/20000').send({ price: 500 });
        expect(res.status).toBe(404);
    })

    it('should reject invalid id type', async () => {
        const res = await request(app).patch('/api/events/abc').send({ price: 500 });
        expect(res.status).toBe(400);
    })
})
*/
    // it.todo('', async () => {

    // });

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