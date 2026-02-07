import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Check if admin exists
        const admin = await prisma.user.findUnique({
            where: { userId: 'admin' }
        });

        if (!admin) {
            console.log('❌ Admin user not found! Creating new admin...');

            // Create admin user
            await prisma.user.create({
                data: {
                    userId: 'admin',
                    name: 'Admin User',
                    password: hashedPassword,
                    role: 'ADMIN',
                    walletBalance: 0,
                    isActive: true
                }
            });

            console.log('✅ Admin user created successfully!');
        } else {
            console.log('✅ Admin user found! Resetting password...');

            // Update password
            await prisma.user.update({
                where: { userId: 'admin' },
                data: {
                    password: hashedPassword,
                    isActive: true
                }
            });

            console.log('✅ Admin password reset successfully!');
        }

        console.log('\n📝 Admin Credentials:');
        console.log('   User ID: admin');
        console.log('   Password: admin123');
        console.log('\nYou can now login with these credentials.\n');

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

resetAdminPassword();
