import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const userController = {
    // Get all users (admin only)
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    role: true,
                    walletBalance: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            res.json({ users });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    // Get single user by ID (admin only)
    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    role: true,
                    walletBalance: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user });
        } catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },

    // Create new user (admin only)
    async createUser(req: Request, res: Response) {
        try {
            const { userId, name, password, role, walletBalance, isActive } = req.body;

            // Validation
            if (!userId || !name || !password) {
                return res.status(400).json({ error: 'userId, name, and password are required' });
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { userId },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'User ID already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    userId,
                    name,
                    password: hashedPassword,
                    role: role || 'CUSTOMER',
                    walletBalance: walletBalance || 0,
                    isActive: isActive !== undefined ? isActive : true,
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    role: true,
                    walletBalance: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            res.status(201).json({ user });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    },

    // Update user (admin only)
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId, name, password, role, walletBalance, isActive } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { id },
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // If userId is being changed, check if new userId is available
            if (userId && userId !== existingUser.userId) {
                const userIdTaken = await prisma.user.findUnique({
                    where: { userId },
                });

                if (userIdTaken) {
                    return res.status(400).json({ error: 'User ID already exists' });
                }
            }

            // Prepare update data
            const updateData: any = {};
            if (userId) updateData.userId = userId;
            if (name) updateData.name = name;
            if (password) updateData.password = await bcrypt.hash(password, 10);
            if (role) updateData.role = role;
            if (walletBalance !== undefined) updateData.walletBalance = walletBalance;
            if (isActive !== undefined) updateData.isActive = isActive;

            // Update user
            const user = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    role: true,
                    walletBalance: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            res.json({ user });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    },

    // Delete user (admin only)
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { id },
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Delete user
            await prisma.user.delete({
                where: { id },
            });

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    },
};
