import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { UserPreferences } from '../models/UserPreferences.js';
import { UserProgress } from '../models/UserProgress.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Sign up
router.post(
    '/signup',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ error: 'User already exists' });
                return;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                email,
                password: hashedPassword,
                role: 'user',
            });

            // Create default preferences and progress
            await Promise.all([
                UserPreferences.create({ userId: user._id }),
                UserProgress.create({ userId: user._id }),
            ]);

            // Generate token
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
                expiresIn: '7d',
            });

            res.status(201).json({
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    profileImage: user.profileImage,
                    role: user.role,
                },
                token,
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Sign in
router.post(
    '/signin',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').exists(),
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            // Generate token
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
                expiresIn: '7d',
            });

            res.json({
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    profileImage: user.profileImage,
                    role: user.role,
                },
                token,
            });
        } catch (error) {
            console.error('Signin error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const [preferences, progress] = await Promise.all([
            UserPreferences.findOne({ userId: user._id }),
            UserProgress.findOne({ userId: user._id }),
        ]);

        res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                profileImage: user.profileImage,
                role: user.role,
            },
            preferences,
            progress,
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.patch('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username, profileImage } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { username, profileImage },
            { new: true, select: '-password' }
        );

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sign out (client-side token removal)
router.post('/signout', (req: Request, res: Response): void => {
    res.json({ message: 'Signed out successfully' });
});

export default router;
