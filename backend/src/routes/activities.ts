import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { Activity } from '../models/Activity.js';

const router = Router();

// Get user activities
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = parseInt(req.query.skip as string) || 0;

        const activities = await Activity.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await Activity.countDocuments({ userId: req.userId });

        res.json({
            activities,
            total,
            hasMore: skip + limit < total,
        });
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create activity
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, description, metadata } = req.body;

        const activity = await Activity.create({
            userId: req.userId,
            type,
            description,
            metadata,
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all activities (admin only)
router.get('/all', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;
        const skip = parseInt(req.query.skip as string) || 0;

        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('userId', 'username email');

        const total = await Activity.countDocuments();

        res.json({
            activities,
            total,
            hasMore: skip + limit < total,
        });
    } catch (error) {
        console.error('Get all activities error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
