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

const generateTokens = (userId: string, id: string) => {
    const accessToken = jwt.sign(
        { userId, id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
        { userId, id },
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
    );

    return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
    try {
        const { userId, password } = req.body as LoginRequest;

        if (!userId || !password) {
            return res.status(400).json({ error: 'User ID and password are required' });
        }

        // Find user by userId
        const user = await prisma.user.findUnique({
            where: { userId: userId.trim() }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is inactive' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.userId, user.id);

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

export const register = async (req: Request, res: Response) => {
    try {
        const { userId, name, password, role } = req.body as RegisterRequest;

        if (!userId || !name || !password) {
            return res.status(400).json({ error: 'User ID, name, and password are required' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { userId: userId.trim() }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'User ID already exists' });
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
        const { accessToken, refreshToken } = generateTokens(newUser.userId, newUser.id);

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

export const me = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId; // Set by auth middleware

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
