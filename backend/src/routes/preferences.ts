import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { UserPreferences } from '../models/UserPreferences.js';

const router = Router();

// Get user preferences
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let preferences = await UserPreferences.findOne({ userId: req.userId });

        if (!preferences) {
            preferences = await UserPreferences.create({ userId: req.userId });
        }

        res.json(preferences);
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user preferences
router.patch('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { language, theme, notifications } = req.body;

        const preferences = await UserPreferences.findOneAndUpdate(
            { userId: req.userId },
            { language, theme, notifications },
            { new: true, upsert: true }
        );

        res.json(preferences);
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
