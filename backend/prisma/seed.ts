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

  // 3. Customers
  const customersData = [
    { name: 'Alice Customer', phone: '9811111111', email: 'alice@example.com' },
    { name: 'Bob Customer', phone: '9822222222', email: 'bob@example.com' },
    { name: 'Charlie Dave', phone: '9833333333', email: 'charlie@example.com' },
    { name: 'Diana Prince', phone: '9844444444', email: 'diana@example.com' },
    { name: 'Ethan Hunt', phone: '9855555555', email: 'ethan@example.com' },
  ];

  const customers = [];
  for (const c of customersData) {
    const customer = await prisma.user.upsert({
      where: { phone: c.phone },
      update: {},
      create: {
        name: c.name,
        phone: c.phone,
        role: 'customer',
        email: c.email,
      },
    });
    customers.push(customer);
  }

  // 4. Vehicles
  const vehiclesData = [
    { model: 'Toyota Hilux', number: 'BA-1-PA-1234', customerIdx: 0 },
    { model: 'Honda CR-V', number: 'BA-2-CHA-5678', customerIdx: 1 },
    { model: 'Ford Ranger', number: 'BA-3-KA-9999', customerIdx: 2 },
    { model: 'Hyundai Tucson', number: 'BA-4-LA-1111', customerIdx: 3 },
    { model: 'Suzuki Swift', number: 'BA-5-MA-2222', customerIdx: 4 },
  ];

  const vehicles = [];
  for (const v of vehiclesData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { number: v.number },
      update: {},
      create: {
        model: v.model,
        number: v.number,
        customerId: customers[v.customerIdx].id,
      },
    });
    vehicles.push(vehicle);
  }

  // 5. Bookings
  const serviceTypes = ['Full Service', 'Car Wash', 'Engine Repair', 'Brake Check', 'Oil Change', 'Wheel Alignment'];
  const statuses = ['pending', 'in-progress', 'completed', 'cancelled'];

  for (let i = 0; i < 15; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    await prisma.booking.create({
      data: {
        vehicleId: vehicle.id,
        serviceType,
        status,
        notes: `Randomly generated note for ${serviceType}.`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in last 30 days
      },
    });
  }

  console.log('Database seeded with rich dummy data:');
  console.log(`- ${staffMembers.length + 1} Staff/Admins`);
  console.log(`- ${customers.length} Customers`);
  console.log(`- ${vehicles.length} Vehicles`);
  console.log(`- 15 Bookings`);
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
