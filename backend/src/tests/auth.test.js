const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const app = require('../../index');
const User = require('../models/user.model');

beforeAll(async () => {
    jest.setTimeout(10000);
    await connectDB(true);
});

afterAll(async () => {
    await User.deleteMany({});
    await disconnectDB();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('Auth API Tests', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'Test@123456' // Valid password with special character
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
            expect(res.body.error).toBe('USER_EXISTS');
        });

        describe('Password Validation', () => {
            it('should not register user with password less than 8 characters', async () => {
                const res = await request(app)
                    .post('/api/register')
                    .send({
                        email: 'test@example.com',
                        password: 'Test@12'
                    });

                expect(res.status).toBe(400);
                expect(res.body.error).toBe('INVALID_PASSWORD');
            });

            it('should not register user with password missing uppercase letter', async () => {
                const res = await request(app)
                    .post('/api/register')
                    .send({
                        email: 'test@example.com',
                        password: 'test@12345'
                    });

                expect(res.status).toBe(400);
                expect(res.body.error).toBe('INVALID_PASSWORD');
            });

            it('should not register user with password missing lowercase letter', async () => {
                const res = await request(app)
                    .post('/api/register')
                    .send({
                        email: 'test@example.com',
                        password: 'TEST@12345'
                    });

                expect(res.status).toBe(400);
                expect(res.body.error).toBe('INVALID_PASSWORD');
            });

            it('should not register user with password missing special character', async () => {
                const res = await request(app)
                    .post('/api/register')
                    .send({
                        email: 'test@example.com',
                        password: 'Test123456'
                    });

                expect(res.status).toBe(400);
                expect(res.body.error).toBe('INVALID_PASSWORD');
            });

            it('should not register user with password missing number', async () => {
                const res = await request(app)
                    .post('/api/register')
                    .send({
                        email: 'test@example.com',
                        password: 'Test@abcdef'
                    });

                expect(res.status).toBe(400);
                expect(res.body.error).toBe('INVALID_PASSWORD');
            });
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
                    password: 'wrongPassword@123'
                });

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('INVALID_CREDENTIALS');
        });

        it('should not allow login with empty password', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: testUser.email,
                    password: ''
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('MISSING_FIELDS');
        });

        it('should not allow login with empty email', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: '',
                    password: testUser.password
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('MISSING_FIELDS');
        });

        it('should lock account after 5 failed login attempts', async () => {
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/api/login')
                    .send({
                        email: testUser.email,
                        password: 'wrongPassword@123'
                    });
            }

            const res = await request(app)
                .post('/api/login')
                .send({
                    email: testUser.email,
                    password: 'wrongPassword@123'
                });

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('ACCOUNT_LOCKED');
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
            expect(res.body.error).toBe('AUTH_NO_TOKEN');
        });
    });
});