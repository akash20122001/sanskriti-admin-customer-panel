const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { userId: 'admin' },
    update: {},
    create: {
      userId: 'admin',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      walletBalance: 0,
      isActive: true
    }
  });
  console.log('✅ Admin user created:', { userId: admin.userId, role: admin.role });

  // Create test customer
  const customerPassword = await bcrypt.hash('password123', 10);
  const customer = await prisma.user.upsert({
    where: { userId: 'test_user' },
    update: {},
    create: {
      userId: 'test_user',
      name: 'Test Customer',
      password: customerPassword,
      role: 'CUSTOMER',
      walletBalance: 5000,
      isActive: true
    }
  });
  console.log('✅ Test customer created:', { userId: customer.userId, role: customer.role });
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
