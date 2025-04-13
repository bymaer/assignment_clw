import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/user.model.js';

const validatePassword = (password) => {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);
};

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                error: 'MISSING_FIELDS'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: 'Invalid email format',
                error: 'INVALID_EMAIL'
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
                error: 'INVALID_PASSWORD'
            });
        }

        const sanitizedEmail = validator.normalizeEmail(email.toLowerCase().trim());

        const existingUser = await User.findOne({ email: sanitizedEmail });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
                error: 'USER_EXISTS'
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email: sanitizedEmail,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error creating user',
            error: 'SERVER_ERROR'
        });
    }
};

const login = async (req, res) => {
    try {
        console.log('Login attempt received:', { email: req.body.email });
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing fields in login attempt');
            return res.status(400).json({
                message: 'Email and password are required',
                error: 'MISSING_FIELDS'
            });
        }

        const sanitizedEmail = validator.normalizeEmail(email.toLowerCase().trim());
        console.log('Looking for user with email:', sanitizedEmail);

        const user = await User.findOne({ email: sanitizedEmail }).select('+password');
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'INVALID_CREDENTIALS'
            });
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
            console.log('Account is locked until:', user.lockedUntil);
            return res.status(403).json({
                message: 'Account is temporarily locked. Try again later',
                error: 'ACCOUNT_LOCKED'
            });
        }

        console.log('Comparing passwords...');
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', validPassword);

        if (!validPassword) {
            user.loginAttempts += 1;
            console.log('Invalid password. Login attempts:', user.loginAttempts);

            if (user.loginAttempts >= 5) {
                user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                await user.save();
                return res.status(403).json({
                    message: 'Too many failed attempts. Account locked for 15 minutes',
                    error: 'ACCOUNT_LOCKED'
                });
            }

            await user.save();
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'INVALID_CREDENTIALS'
            });
        }

        user.loginAttempts = 0;
        user.lastLogin = new Date();
        user.lockedUntil = null;
        await user.save();

        console.log('Creating JWT token...');
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30m',
                algorithm: 'HS256'
            }
        );
        console.log('Token created successfully');

        res.json({
            message: 'Logged in successfully',
            token,
            expiresIn: 1800
        });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: 'SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export { register, login };