const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@yatrabharat.com' },
    update: {},
    create: {
      email: 'admin@yatrabharat.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin user created/verified:', admin.email);

  // 1.5 Seed Categories
  let catHeritage = await prisma.category.findFirst({ where: { name: 'Heritage' } });
  if (!catHeritage) {
    catHeritage = await prisma.category.create({ data: { name: 'Heritage' } });
  }
  
  let catNature = await prisma.category.findFirst({ where: { name: 'Nature' } });
  if (!catNature) {
    catNature = await prisma.category.create({ data: { name: 'Nature' } });
  }

  // 2. Seed Destinations
  const dest1 = await prisma.destination.upsert({
    where: { slug: 'royal-rajasthan' },
    update: {},
    create: {
      name: 'Royal Rajasthan',
      slug: 'royal-rajasthan',
      region: 'North India',
      categoryId: catHeritage.id,
      summary: 'Experience the grandeur of forts, palaces, and deserts.',
      description: 'Rajasthan is the crown jewel of India, offering a majestic blend of vibrant culture, ancient forts, and sweeping desert landscapes. Explore the Pink City of Jaipur, the lakes of Udaipur, and the golden dunes of Jaisalmer.',
      bestSeason: 'October to March',
      status: 'PUBLISHED'
    }
  });

  const dest2 = await prisma.destination.upsert({
    where: { slug: 'kerala-backwaters' },
    update: {},
    create: {
      name: 'Kerala Backwaters',
      slug: 'kerala-backwaters',
      region: 'South India',
      categoryId: catNature.id,
      summary: 'Sail through serene backwaters in God\'s Own Country.',
      description: 'Kerala offers an unparalleled tropical retreat. Glide along the emerald backwaters of Alleppey in a traditional houseboat, surrounded by lush palm trees and tranquil village life.',
      bestSeason: 'September to March',
      status: 'PUBLISHED'
    }
  });

  const dest3 = await prisma.destination.upsert({
    where: { slug: 'mystical-himalayas' },
    update: {},
    create: {
      name: 'Mystical Himalayas',
      slug: 'mystical-himalayas',
      region: 'North India',
      categoryId: catNature.id,
      summary: 'Find peace and adventure in the snow-capped peaks.',
      description: 'The Himalayas offer breathtaking mountain vistas, spiritual retreats, and thrilling treks. Visit Manali, Shimla, or Leh-Ladakh for an unforgettable high-altitude experience.',
      bestSeason: 'April to June',
      status: 'PUBLISHED'
    }
  });

  console.log('Seeded Destinations');

  // 3. Seed Travel Plans
  await prisma.travelPlan.upsert({
    where: { slug: '7-days-rajasthan-heritage' },
    update: {},
    create: {
      name: '7 Days Rajasthan Heritage Tour',
      slug: '7-days-rajasthan-heritage',
      durationDays: 7,
      priceAmount: 45000,
      priceCurrency: 'INR',
      status: 'PUBLISHED',
      destinations: {
        create: [
          { destinationId: dest1.id }
        ]
      }
    }
  });

  await prisma.travelPlan.upsert({
    where: { slug: '5-days-kerala-retreat' },
    update: {},
    create: {
      name: '5 Days Kerala Backwaters Retreat',
      slug: '5-days-kerala-retreat',
      durationDays: 5,
      priceAmount: 32000,
      priceCurrency: 'INR',
      status: 'PUBLISHED',
      destinations: {
        create: [
          { destinationId: dest2.id }
        ]
      }
    }
  });

  console.log('Seeded Travel Plans');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
