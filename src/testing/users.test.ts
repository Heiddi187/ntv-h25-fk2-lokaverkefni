import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { resetTestDb } from "./setup";
import db from '../config/db';
import jwt from 'jsonwebtoken';

const app = createApp();

beforeEach(async () => {
    await resetTestDb();
});

describe('POST /api/users/signup', () => {
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

    it('should return 404 if route is wrong', async () => {
        const res = await request(app).post('/api/notendur/signup').send({
            name: 'TestingAgain',
            email: 'testy@test.is',
            password: 'anothersupersecretpassword'
        });
        expect(res.status).toBe(404);
    });

    it('should return 400 if signup data is wrong type', async () => {
        const res = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 4641616165161651
        });
        expect(res.status).toBe(400);
    });

    it('should reject if signup data is missing', async () => {
        const res = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            //email: 'testy@test.is',
            password: "4641616165161651"
        });
        expect(res.status).toBe(400);
    });

    it('should reject if email format is wrong', async () => {
        const res = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@gmail',
            password: "4641616165161651"
        });
        expect(res.status).toBe(400);
    });
})

describe('POST /api/users/login', () => {
    it('should login using newly created user', async () => {
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

    it('should login a user from database', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'anna@test.is',
            password: 'secret123'
        });
        expect(res.body.token).toBeDefined();
        expect(res.status).toBe(200);
    })

    it('should return 401 if password is wrong', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'anna@test.is',
            password: 'secret123456'
        });
        expect(res.status).toBe(401);
    })

});

describe('PATCH /api/users/user', () => {
    it('should update user', async () => {
        const signup = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        const token = signup.body.token;
        
        const res = await request(app)
            .patch('/api/users/user')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'update name' })

        expect(res.body.name).toBe('update name');
        expect(res.status).toBe(200);
    });

    it('should only allow new password to login after change', async () => {
        const signup = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'oldpassword'
        });
        const token = signup.body.token;

        await request(app)
            .patch('/api/users/user')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'newpassword' });

        const newlogin = await request(app).post('/api/users/login').send({
            email: 'testy@test.is',
            password: 'newpassword'
        });
        expect(newlogin.status).toBe(200);

        const oldlogin = await request(app).post('/api/users/login').send({
            email: 'testy@test.is',
            password: 'oldpassword'
        });
        expect(oldlogin.status).toBe(401);
        
    });

    it('should reject if no authorization', async () => {
        const signup = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        const token = signup.body.token;
        
        const res = await request(app)
            .patch('/api/users/user')
            //.set('Authorization', `Bearer ${token}`)
            .send({ name: 'update name' })

        expect(res.status).toBe(401);
    });

    it('should reject if token is expired', async () => {
        const token = jwt.sign({ sub: 1, role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '-1s' });
        
        const res = await request(app)
            .patch('/api/users/user')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'update name' })

        expect(res.status).toBe(403);
    });

    it('should reject if updated data is of wrong type', async () => {
        const signup = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        const token = signup.body.token;
        
        const res = await request(app)
            .patch('/api/users/user')
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 1234567890 });

        expect(res.status).toBe(400);
    })
});

describe('DELETE /api/users/user', () => {
    it('should delete account', async () => {
        const signup = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        const token = signup.body.token;
        
        const res = await request(app)
            .delete('/api/users/user')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(204);

        const login = await request(app).post('/api/users/login').send({
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        expect(login.status).toBe(401);
    });

    it('should reject if not authorized', async () => {
        const signup = await request(app).post('/api/users/signup').send({
            name: 'Testing',
            email: 'testy@test.is',
            password: 'supersecretpassword'
        });
        const token = signup.body.token;
        
        const res = await request(app)
            .delete('/api/users/user')

        expect(res.status).toBe(401);
    })
})

