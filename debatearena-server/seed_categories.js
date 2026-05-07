const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Politics', slug: 'politics' },
  { name: 'Science', slug: 'science' },
  { name: 'Philosophy', slug: 'philosophy' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Culture', slug: 'culture' },
  { name: 'Other', slug: 'other' },
];

async function main() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
    console.log(`- ${category.name}: ${category.id}`);
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
