import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import User from '../models/user.model.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Debug route - only in development
if (process.env.NODE_ENV === 'development') {
    router.get('/debug/users', async (req, res) => {
        try {
            const users = await User.find({}).select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

export default router;