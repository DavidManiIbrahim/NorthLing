import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { UserProgress } from '../models/UserProgress.js';
import { Activity } from '../models/Activity.js';

const router = Router();

// Get user progress
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let progress = await UserProgress.findOne({ userId: req.userId });

        if (!progress) {
            progress = await UserProgress.create({ userId: req.userId });
        }

        res.json(progress);
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user progress
router.patch('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { level, xp, streak, lessonsCompleted } = req.body;

        const progress = await UserProgress.findOneAndUpdate(
            { userId: req.userId },
            {
                level,
                xp,
                streak,
                lessonsCompleted,
                lastActivityDate: new Date(),
            },
            { new: true, upsert: true }
        );

        // Log activity
        await Activity.create({
            userId: req.userId,
            type: 'progress_update',
            description: 'User progress updated',
            metadata: { level, xp, streak, lessonsCompleted },
        });

        res.json(progress);
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res: Response): Promise<void> => {
    try {
        const leaderboard = await UserProgress.find()
            .sort({ xp: -1 })
            .limit(100)
            .populate('userId', 'username email profileImage');

        res.json(leaderboard);
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
