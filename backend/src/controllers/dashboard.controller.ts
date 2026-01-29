import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dashboardController = {
    // Get admin dashboard statistics
    async getAdminStats(req: Request, res: Response): Promise<any> {
        try {
            // 1. Total Users
            const totalUsers = await prisma.user.count({
                where: { role: 'CUSTOMER' }
            });

            // 2. Active Users
            const activeUsers = await prisma.user.count({
                where: { role: 'CUSTOMER', isActive: true }
            });

            // 3. Total Transactions (Count)
            const totalTransactions = await prisma.transaction.count();

            // 4. Total Revenue (Sum of successful credits)
            // Note: Revenue usually comes from CREDIT transactions (money coming in) 
            // BUT in this system, Admin might consider bill payments as revenue.
            // Let's assume Total Revenue = Sum of all Bill payableAmounts.
            // OR Sum of all successful CREDIT transactions if that's how money enters.
            // Let's go with Bill amounts for now as that represents sales.
            const revenueResult = await prisma.bill.aggregate({
                _sum: {
                    payableAmount: true
                }
            });
            const totalRevenue = revenueResult._sum.payableAmount || 0;

            // 5. Recent Activity (Mix of recent users, transactions, orders)
            // For simplicity, let's fetch recent transactions
            const recentTransactions = await prisma.transaction.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
            });

            // Fetch user details for these transactions
            const userIds = [...new Set(recentTransactions.map(t => t.userId))];
            const users = await prisma.user.findMany({
                where: { userId: { in: userIds } },
                select: { userId: true, name: true }
            });

            const userMap = new Map(users.map(u => [u.userId, u.name]));

            // Format recent activity
            // We can map these to a generic activity structure
            const recentActivity = recentTransactions.map(txn => ({
                id: txn.id,
                type: 'TRANSACTION',
                message: `${txn.type === 'CREDIT' ? 'Credit' : 'Debit'} of ₹${txn.amount} for ${userMap.get(txn.userId) || txn.userId}`,
                date: txn.createdAt,
                status: txn.status
            }));

            res.json({
                stats: {
                    totalUsers,
                    activeUsers,
                    totalTransactions,
                    totalRevenue
                },
                recentActivity
            });

        } catch (error) {
            console.error('Get admin dashboard stats error:', error);
            res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
        }
    }
};
