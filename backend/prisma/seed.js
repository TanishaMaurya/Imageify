import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@imageify.com';
  const password = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Admin',
      email,
      password,
      role: 'ADMIN',
      credits: 999,
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Seeded admin user:', email, '(password: Admin@123)');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
