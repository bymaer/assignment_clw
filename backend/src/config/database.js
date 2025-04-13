const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

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
            console.log('Test user created successfully with email and password:', testUser.email, testUser.password);
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

        mongoServer = await MongoMemoryServer.create();
        const mongoUri = await mongoServer.getUri();

        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            autoIndex: true,
            retryWrites: true,
            family: 4
        };

        mongoose.set('strictQuery', true);

        mongoose.connection.on('connected', async () => {
            console.log('Mongoose connected to MongoDB');
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

module.exports = { connectDB, disconnectDB };