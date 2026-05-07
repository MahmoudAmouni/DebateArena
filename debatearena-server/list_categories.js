const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const categories = await prisma.category.findMany();
    console.log(JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
