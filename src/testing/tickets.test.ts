import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { resetTestDb } from "./setup";
import db from '../config/db';
import jwt from 'jsonwebtoken';
import { oldTicketsExpireModel } from "../models/ticketModel";

const app = createApp();

beforeAll(async () => {
    await resetTestDb();
});

const signupUser = {
    name: 'Test user',
    email: 'tester@email.com',
    password: 'passedtheword'
};

const loginUser = {
    email: 'tester@email.com',
    password: 'passedtheword'
}

describe('GET /api/tickets/user', async () => {
    it('should exist and return 200 status', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const res = await request(app).get('/api/tickets/user').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined();
    });

    it('should return an empty list', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const res = await request(app).get('/api/tickets/user').set('Authorization', `Bearer ${token}`);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    it('should ereject if token is missing or wrong', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const fakeToken = 'æhnagbgkjbkabgkbgajk'
        const res = await request(app).get('/api/tickets/user').set('Authorization', `Bearer ${fakeToken}`);
        expect(res.status).toBe(403)
    });

});

describe('POST /api/tickets/buy', async () => {
    it('should exist and return 200 status', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const res = await request(app)
            .post('/api/tickets/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                event_id: 1,
                quantity: 4 
            });
        expect(res.status).toBe(201)
        expect(res.body).toBeDefined();
    });

    it('should buy correct amount of tickets to the right event', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const res = await request(app)
            .post('/api/tickets/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                event_id: 1,
                quantity: 4 
            });
        expect(res.body.event_id).toBe(1)
        expect(res.body.quantity).toBe(4);
    });

    it('should reject unauthorized user', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const res = await request(app)
            .post('/api/tickets/buy')
            //.set('Authorization', `Bearer ${token}`)
            .send({
                event_id: 1,
                quantity: 4 
            });
        expect(res.status).toBe(401)
    });

    it('should throw 404 if path is wrong', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const res = await request(app)
            .post('/api/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                event_id: 1,
                quantity: 4 
            });
        expect(res.status).toBe(404)
    });
});

describe('PATCH /api/tickets/:id/return', async () => {
    it('should return and mark ticket as refunded', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const buy = await request(app)
            .post('/api/tickets/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                event_id: 1,
                quantity: 5 
            }
        );
        const ticketId = buy.body.id;
        expect(buy.body.quantity).toBe(5)
        const res = await request(app).patch(`/api/tickets/${ticketId}/return`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        expect(res.body.ticket_status).toBe('refunded')
    });

    it('should return tickets to event after refund', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;

        const before = await db.one(
            `SELECT tix_available FROM events WHERE id = 1`
        );
        //console.log('before: ', before) // 1792
        const buy = await request(app)
            .post('/api/tickets/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({ event_id: 1, quantity: 3 });

        const ticketId = buy.body.id;

        // const during = await db.one(
        //     `SELECT tix_available FROM events WHERE id = 1`
        // );
        // console.log('during: ', during) // 1789

        const res = await request(app)
            .patch(`/api/tickets/${ticketId}/return`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.ticket_status).toBe('refunded');

        const after = await db.one(
            `SELECT tix_available FROM events WHERE id = 1`
        );
        //console.log('after: ', after) // 1792

        expect(after.tix_available).toBe(before.tix_available);
    })

    it('should throw 400 if you try to return ticket again', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;
        const buy = await request(app)
            .post('/api/tickets/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                event_id: 2,
                quantity: 7 
            }
        );
        const ticketId = buy.body.id;
        expect(buy.body.quantity).toBe(7)
        await request(app).patch(`/api/tickets/${ticketId}/return`).set('Authorization', `Bearer ${token}`)
        const res = await request(app).patch(`/api/tickets/${ticketId}/return`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(400);
    });

    it('should reject if less then 24h to event', async () => {
        await request(app).post('/api/users/signup').send(signupUser);
        const login = await request(app).post('/api/users/login').send(loginUser);
        const token = login.body.token;

        const in10hours = await db.one(`
            WITH ts AS (SELECT NOW() + INTERVAL '2 hours' AS t)
            INSERT INTO events (title, event_date, event_time, duration, venue_id, price, tix_available)
            SELECT 
                'Event in 2 hours',
                t::date,
                t::time,
                60, 2, 123, 10
                FROM ts
                RETURNING *
        `);
        const buy = await request(app)
            .post('/api/tickets/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                event_id: in10hours.id,
                quantity: 2 
            }
        );
        const ticketId = buy.body.id;
        const res = await request(app).patch(`/api/tickets/${ticketId}/return`).set('Authorization', `Bearer ${token}`);
        //console.log(res)
        expect(res.status).toBe(400);
    })

    it('should reject if event has passed', async () => {
        const login = await request(app).post('/api/users/login').send({
            email: "anna@test.is",
            password: "secret123"
        });

        const token = login.body.token;

        const expiredEvent = await db.one(`
            INSERT INTO events (title, event_date, event_time, duration, venue_id, price, tix_available)
            VALUES (
            'Expired Test Event',
            (NOW() - INTERVAL '2 days')::date,
            (NOW() - INTERVAL '2 days')::time,
            60,
            1,
            100,
            10
            )
            RETURNING id
        `);

        const ticket = await db.one(`
            INSERT INTO tickets (user_id, event_id, quantity, total_price)
            VALUES (1, $1, 2, 200)
            RETURNING id
        `, [expiredEvent.id]);

        const res = await request(app)
            .patch(`/api/tickets/${ticket.id}/return`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Ticket has expired');
    }); 
});



// INSERT INTO events (title, event_date, event_time, duration, venue_id, price, tix_available)
//             VALUES ('Event already passed',
//                 '2025-05-08T00:00:00.000Z',
//                 '00:00', 60, 2, 123, 10)
//             RETURNING id