import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Categories
  const categoriesData = [
    { name: 'Politics', slug: 'politics' },
    { name: 'Science', slug: 'science' },
    { name: 'Philosophy', slug: 'philosophy' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Culture', slug: 'culture' },
    { name: 'Other', slug: 'other' },
  ];

  console.log('Seeding categories...');
  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  // 2. Seed Badges
  const badgesData = [
    { slug: 'first_win', name: 'First Win', description: 'Won your first debate.' },
    { slug: 'five_streak', name: 'Hot Streak', description: 'Won 5 debates in a row.' },
    { slug: 'fact_check_champion', name: 'Fact Checker', description: 'Successfully verified 10 claims.' },
    { slug: 'perfect_score', name: 'Perfect Score', description: 'Received a 10/10 from the AI Judge.' },
  ];

  console.log('Seeding badges...');
  const badges = await Promise.all(
    badgesData.map((badge) =>
      prisma.badge.upsert({
        where: { slug: badge.slug },
        update: {},
        create: badge,
      })
    )
  );

  // 3. Seed Users
  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'ai_skeptic@example.com' },
    update: {},
    create: {
      username: 'AI_Skeptic',
      email: 'ai_skeptic@example.com',
      passwordHash,
      globalElo: 1250,
      totalWins: 15,
      totalLosses: 5,
      isVerified: true,
      bio: 'Always questioning the black box.',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'tech_optimist@example.com' },
    update: {},
    create: {
      username: 'Tech_Optimist',
      email: 'tech_optimist@example.com',
      passwordHash,
      globalElo: 1400,
      totalWins: 25,
      totalLosses: 2,
      isVerified: true,
      bio: 'Building the future one line at a time.',
    },
  });

  // 4. Seed User Topic Ratings (ELO per category)
  console.log('Seeding user topic ratings...');
  const techCategory = categories.find(c => c.slug === 'technology')!;
  
  await prisma.userTopicRating.upsert({
    where: { userId_categoryId: { userId: user1.id, categoryId: techCategory.id } },
    update: {},
    create: {
      userId: user1.id,
      categoryId: techCategory.id,
      elo: 1300,
      wins: 10,
      losses: 5,
      debatesCount: 15,
    },
  });

  await prisma.userTopicRating.upsert({
    where: { userId_categoryId: { userId: user2.id, categoryId: techCategory.id } },
    update: {},
    create: {
      userId: user2.id,
      categoryId: techCategory.id,
      elo: 1500,
      wins: 20,
      losses: 2,
      debatesCount: 22,
    },
  });

  // 5. Seed Sessions (1 Completed, 1 Open)
  console.log('Seeding sessions...');
  
  // Completed Session
  const completedSession = await prisma.session.create({
    data: {
      categoryId: techCategory.id,
      creatorId: user2.id,
      title: 'Is AI going to replace software engineers by 2030?',
      description: 'Will AGI write better code than humans within the decade?',
      format: 'standard',
      visibility: 'public',
      status: 'completed',
      totalRounds: 3,
      expiresAt: new Date(Date.now() + 86400000),
      creatorStance: 'Yes, exponential growth guarantees it.',
      questions: [
        "What defines 'software engineering' vs 'coding'?",
        "How will AI handle legacy system integrations?",
        "What are the economic drivers for replacing developers?"
      ],
      participants: {
        create: [
          {
            userId: user2.id,
            role: 'creator',
            stance: 'Yes, exponential growth guarantees it.',
            isReady: true,
            eloBefore: 1450,
            eloAfter: 1500,
            eloChange: 50,
          },
          {
            userId: user1.id,
            role: 'joiner',
            stance: 'No, AI lacks the context required for real architecture.',
            isReady: true,
            eloBefore: 1350,
            eloAfter: 1300,
            eloChange: -50,
          }
        ]
      }
    },
    include: { participants: true }
  });

  // Verdict for Completed Session
  console.log('Seeding verdict...');
  await prisma.verdict.create({
    data: {
      sessionId: completedSession.id,
      winnerParticipantId: completedSession.participants.find(p => p.userId === user2.id)?.id,
      isTie: false,
      summary: 'Tech_Optimist presented a more cohesive argument grounded in current trends of exponential capabilities, whereas AI_Skeptic relied too heavily on moving the goalposts regarding human creativity.',
      scores: {
        create: [
          {
            participantId: completedSession.participants.find(p => p.userId === user2.id)!.id,
            criterion: 'logic',
            score: 9.5,
            explanation: 'Flawless logical progression.'
          },
          {
            participantId: completedSession.participants.find(p => p.userId === user1.id)!.id,
            criterion: 'logic',
            score: 7.0,
            explanation: 'Some leaps in logic regarding human exceptionalism.'
          }
        ]
      }
    }
  });

  // Open Session
  await prisma.session.create({
    data: {
      categoryId: categories.find(c => c.slug === 'philosophy')!.id,
      creatorId: user1.id,
      title: 'Do humans actually have free will?',
      description: 'In a deterministic universe, is free will merely an illusion?',
      format: 'quick',
      visibility: 'public',
      status: 'open',
      totalRounds: 1,
      expiresAt: new Date(Date.now() + 86400000),
      creatorStance: 'Free will is an illusion caused by our ignorance of the causes of our actions.',
      questions: [
        "What is compatibilism?",
        "Does quantum randomness allow for free will?"
      ],
      participants: {
        create: [
          {
            userId: user1.id,
            role: 'creator',
            stance: 'Free will is an illusion caused by our ignorance of the causes of our actions.',
          }
        ]
      }
    }
  });

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
