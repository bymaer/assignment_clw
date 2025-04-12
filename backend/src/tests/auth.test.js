const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const app = require('../../index');
const User = require('../models/user.model');

beforeAll(async () => {
    await connectDB(true);
});

afterAll(async () => {
    await disconnectDB();
    await new Promise(resolve => setTimeout(resolve, 500)); // Даем время на закрытие соединений
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('Auth API Tests', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'testPassword123'
    };

    describe('POST /api/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/register')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User created successfully');
        });

        it('should not register user with existing email', async () => {
            await request(app)
                .post('/api/register')
                .send(testUser);

            const res = await request(app)
                .post('/api/register')
                .send(testUser);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/register')
                .send(testUser);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/login')
                .send(testUser);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('expiresIn');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: testUser.email,
                    password: 'wrongPassword'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Invalid password');
        });
    });

    describe('GET /api/protected', () => {
        let token;

        beforeEach(async () => {
            await request(app)
                .post('/api/register')
                .send(testUser);

            const loginRes = await request(app)
                .post('/api/login')
                .send(testUser);

            token = loginRes.body.token;
        });

        it('should access protected route with valid token', async () => {
            const res = await request(app)
                .get('/api/protected')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('user');
        });

        it('should not access protected route without token', async () => {
            const res = await request(app)
                .get('/api/protected');

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });
    });
});