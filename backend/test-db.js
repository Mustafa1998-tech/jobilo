require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
prisma.$queryRawUnsafe('SELECT 1 + 1 AS result').then(r => {
  console.log('Connection OK:', JSON.stringify(r));
  return prisma.$disconnect();
}).catch(e => {
  console.error('Error:', e.message);
  return prisma.$disconnect();
});
