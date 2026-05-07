import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Politics', slug: 'politics' },
    { name: 'Science', slug: 'science' },
    { name: 'Philosophy', slug: 'philosophy' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Culture', slug: 'culture' },
    { name: 'Other', slug: 'other' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  const badges = [
    { slug: 'first_win', name: 'First Win', description: 'Won your first debate' },
    { slug: 'five_streak', name: '5-Win Streak', description: 'Won 5 debates in a row' },
    { slug: 'ten_streak', name: '10-Win Streak', description: 'Won 10 debates in a row' },
    { slug: 'fact_check_champion', name: 'Fact-Check Champion', description: 'Maintained 90%+ fact-check accuracy' },
    { slug: 'top_100_global', name: 'Top 100 Global', description: 'Reached the global top 100 leaderboard' },
    { slug: 'thousand_spectators', name: 'Thousand Spectators', description: 'Had over 1000 total spectators across debates' },
    { slug: 'perfect_score', name: 'Perfect Score', description: 'Received a perfect 10/10 in all judging criteria' }
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
