const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectDB(isTest = false) {
    try {
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

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
            if (!isTest) {
                process.exit(1);
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
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
        await mongoose.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
        }
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
        throw err;
    }
}

module.exports = { connectDB, disconnectDB };