import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { promisify } from 'util';

const tokenBlacklist = new Set();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Access denied. No token provided.',
                error: 'AUTH_NO_TOKEN'
            });
        }

        if (tokenBlacklist.has(token)) {
            return res.status(401).json({
                message: 'Token has been invalidated',
                error: 'AUTH_INVALID_TOKEN'
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Set security headers
        res.set({
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
        });

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token has expired',
                error: 'AUTH_TOKEN_EXPIRED'
            });
        }

        return res.status(401).json({
            message: 'Invalid token',
            error: 'AUTH_INVALID_TOKEN'
        });
    }
};

const invalidateToken = (token) => {
    tokenBlacklist.add(token);
};

export {
    authenticateToken,
    invalidateToken,
    limiter
};