import { Request, Response, NextFunction } from 'express';

// Middleware to require admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction): any => {
    const userRole = (req as any).userRole;

    if (!userRole) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    next();
};

// Middleware to require customer role
export const requireCustomer = (req: Request, res: Response, next: NextFunction): any => {
    const userRole = (req as any).userRole;

    if (!userRole) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (userRole !== 'CUSTOMER') {
        return res.status(403).json({ error: 'Access denied. Customer role required.' });
    }

    next();
};
