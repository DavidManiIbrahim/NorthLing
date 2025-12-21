import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            req.userId = decoded.userId;
        }
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
