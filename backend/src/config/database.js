import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

let mongoServer;
let isConnected = false;

async function createTestUser() {
    try {
        const testUser = {
            email: 'test@example.com',
            password: 'Test@12345'
        };

        const existingUser = await User.findOne({ email: testUser.email });
        if (!existingUser) {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(testUser.password, salt);

            await User.create({
                email: testUser.email,
                password: hashedPassword
            });
            console.log('Test user created successfully');
        }
    } catch (error) {
        console.error('Error creating test user:', error);
    }
}

async function connectDB(isTest = false) {
    try {
        if (isConnected) {
            return;
        }

        mongoServer = await MongoMemoryServer.create({
            binary: {
                version: '7.0.14',
                systemBinary: process.env.MONGOMS_SYSTEM_BINARY
            }
        });

        const mongoUri = await mongoServer.getUri();

        const mongooseOpts = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            autoIndex: true,
            retryWrites: true,
            family: 4
        };

        mongoose.set('strictQuery', true);

        mongoose.connection.on('connected', async () => {
            console.log('Mongoose connected to MongoDB Memory Server');
            isConnected = true;
            if (!isTest) {
                await createTestUser();
            }
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
            if (!isTest) {
                process.exit(1);
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
            isConnected = false;
        });

        process.on('SIGINT', async () => {
            await disconnectDB();
            process.exit(0);
        });

        await mongoose.connect(mongoUri, mongooseOpts);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        if (!isTest) {
            process.exit(1);
        }
        throw err;
    }
}

async function disconnectDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
        throw err;
    }
}

export { connectDB, disconnectDB };