import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface LoginRequest {
    userId: string;
    password: string;
}

interface RegisterRequest {
    userId: string;
    name: string;
    password: string;
    role?: 'ADMIN' | 'CUSTOMER';
}

const generateTokens = (userId: string, id: string, role: string) => {
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
    const jwtExpiry = process.env.JWT_EXPIRES_IN || '7d';
    const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

    const tokenPayload = {
        userId,
        id,
        role
    };

    const accessToken = jwt.sign(
        tokenPayload,
        jwtSecret,
        { expiresIn: jwtExpiry }
    );

    const refreshToken = jwt.sign(
        tokenPayload,
        refreshSecret,
        { expiresIn: refreshExpiry }
    );

    return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, password } = req.body as LoginRequest;

        if (!userId || !password) {
            res.status(400).json({ error: 'User ID and password are required' });
            return;
        }

        // Find user by userId
        const user = await prisma.user.findUnique({
            where: { userId: userId.trim() }
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Check if user is active
        if (!user.isActive) {
            res.status(403).json({ error: 'Account is inactive' });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.userId, user.id, user.role);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, name, password, role } = req.body as RegisterRequest;

        if (!userId || !name || !password) {
            res.status(400).json({ error: 'User ID, name, and password are required' });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { userId: userId.trim() }
        });

        if (existingUser) {
            res.status(409).json({ error: 'User ID already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                userId: userId.trim(),
                name,
                password: hashedPassword,
                role: role || 'CUSTOMER',
                walletBalance: 0,
                isActive: true
            }
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(newUser.userId, newUser.id, newUser.role);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId; // Set by auth middleware

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
