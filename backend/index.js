const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { connectDB, disconnectDB } = require('./src/config/database');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

// Connect to database
connectDB(process.env.NODE_ENV === 'test');

// Cleanup on app termination
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
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

module.exports = app;