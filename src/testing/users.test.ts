import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { resetTestDb } from "./setup";
import db from '../config/db';

const app = createApp();

beforeEach(async () => {
    await resetTestDb();
});

describe('/api/ Routes', () => {
    it('should signup a user', async () => {
        const res = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
    });

    it('should prevent duplicate emails', async () => {
        await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        const res = await request(app).post('/api/users/signup').send({
            name: 'TestingAgain',
            email: 'testy@test.is',
            password: 'anothersupersecretpassword'
        });
        expect(res.status).toBe(400);
    });

    it('should login using existing user', async () => {
        await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        const res = await request(app).post('/api/users/login').send({
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        expect(res.body.token).toBeDefined();
        expect(res.status).toBe(200);
    });

    it.todo('', async () => {

    });
})

// test

//// signup	
//// duplicate email	
//// login success	
// wrong password	
// protected routes 
// update profile	
// delete profile	