import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const seedDatabase = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Check if users already exist
        const existingUsers = await prisma.user.count();

        if (existingUsers > 0) {
            res.status(400).json({
                error: 'Database already seeded',
                message: `Found ${existingUsers} existing users`
            });
            return;
        }

        // Hash passwords
        const adminPassword = await bcrypt.hash('admin123', 10);
        const customerPassword = await bcrypt.hash('password123', 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                userId: 'admin',
                name: 'Admin User',
                password: adminPassword,
                role: 'ADMIN',
                walletBalance: 0,
                isActive: true
            }
        });

        // Create test customer
        const customer = await prisma.user.create({
            data: {
                userId: 'test_user',
                name: 'Test Customer',
                password: customerPassword,
                role: 'CUSTOMER',
                walletBalance: 100,
                isActive: true
            }
        });

        res.json({
            success: true,
            message: 'Database seeded successfully',
            users: [
                {
                    userId: admin.userId,
                    name: admin.name,
                    role: admin.role
                },
                {
                    userId: customer.userId,
                    name: customer.name,
                    role: customer.role
                }
            ],
            credentials: {
                admin: {
                    userId: 'admin',
                    password: 'admin123'
                },
                customer: {
                    userId: 'test_user',
                    password: 'password123'
                }
            }
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Failed to seed database' });
    }
};
