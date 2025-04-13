import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

import { connectDB, disconnectDB } from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const app = express();

// Connect to database only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Cleanup on app termination
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal server error',
        error: 'SERVER_ERROR'
    });
});

const port = process.env.PORT || 3001;

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, '0.0.0.0', (err) => {
        if (err) {
            console.error('Error starting server:', err);
            return;
        }
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;