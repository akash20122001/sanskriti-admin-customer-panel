import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
    id: string;
    role: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        (req as any).userId = decoded.id;
        (req as any).userIdString = decoded.userId;
        (req as any).userRole = decoded.role;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if ((req as any).userRole !== 'ADMIN') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
};
