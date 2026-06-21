import { PrismaClient } from '../src/generated/prisma/client.js';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DB_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting database cleanup for handover...');

  try {
    // 1. Delete all Bookings first (foreign key dependency on Vehicle)
    const deletedBookings = await prisma.booking.deleteMany({});
    console.log(`✅ Deleted ${deletedBookings.count} booking records.`);

    // 2. Delete all Vehicles (foreign key dependency on User)
    const deletedVehicles = await prisma.vehicle.deleteMany({});
    console.log(`✅ Deleted ${deletedVehicles.count} vehicle records.`);

    // 3. Delete all 'customer' role users
    const deletedCustomers = await prisma.user.deleteMany({
      where: { role: 'customer' }
    });
    console.log(`✅ Deleted ${deletedCustomers.count} customer accounts.`);

    console.log('✨ Database re-initialized. All transaction data and customer accounts cleared while preserving staff/admin logins.');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
