import { PrismaClient } from '../src/generated/prisma/client.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DB_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { phone: '9800000000' },
    update: {},
    create: {
      name: 'Admin User',
      phone: '9800000000',
      role: 'admin',
      password: hashedPassword,
    },
  });

  // 2. Staff members
  const staffMembers = [
    { name: 'John Staff', phone: '9800000001' },
    { name: 'Sarah Tech', phone: '9800000002' },
    { name: 'Mike Mechanic', phone: '9800000003' },
  ];

  for (const s of staffMembers) {
    await prisma.user.upsert({
      where: { phone: s.phone },
      update: {},
      create: {
        name: s.name,
        phone: s.phone,
        role: 'staff',
        password: hashedPassword,
      },
    });
  }

  console.log('Database seeded with essential accounts:');
  console.log(`- 1 Admin`);
  console.log(`- ${staffMembers.length} Staff members`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
