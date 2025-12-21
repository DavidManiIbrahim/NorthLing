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

// Get user progress
router.patch('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { level, xp, lessonsCompleted } = req.body;

        // Fetch current progress to calculate streak
        let currentProgress = await UserProgress.findOne({ userId: req.userId });

        // Calculate Streak
        let newStreak = currentProgress?.streak || 0;
        const now = new Date();
        const lastActivity = currentProgress?.lastActivityDate;

        if (lastActivity) {
            const lastDate = new Date(lastActivity);
            const today = new Date(now);

            // Reset hours to compare dates only
            lastDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                newStreak += 1;
            } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1;
            }
            // If diffDays === 0 (same day), keep existing streak
        } else {
            // First activity
            newStreak = 1;
        }

        const progress = await UserProgress.findOneAndUpdate(
            { userId: req.userId },
            {
                level,
                xp,
                streak: newStreak,
                lessonsCompleted,
                lastActivityDate: now,
            },
            { new: true, upsert: true }
        );

        // Log activity
        await Activity.create({
            userId: req.userId,
            type: 'progress_update',
            description: 'User progress updated',
            metadata: { level, xp, streak: newStreak, lessonsCompleted },
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
