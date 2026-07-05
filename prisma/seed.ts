import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Check if data already exists (for production re-deployments)
  const existingUser = await prisma.user.findFirst()
  if (existingUser) {
    console.log('📊 Database already seeded. Skipping seeding process...')
    return
  }

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      name: 'Alex K.',
      initials: 'AK',
      plan: 'Pro Plan',
    },
  })
  console.log('✅ Created user:', user.name)

  // Create job applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        userId: user.id,
        company: 'J.P. Morgan',
        department: 'Investment Banking Division',
        position: 'Investment Banking Analyst',
        status: 'INTERVIEW',
        appliedDate: new Date('2025-07-01'),
        notes: 'Applied through campus recruiting. Great cultural fit.'
      }
    }),
    prisma.application.create({
      data: {
        userId: user.id,
        company: 'Goldman Sachs',
        department: 'Global Markets',
        position: 'Sales & Trading Analyst',
        status: 'APPLIED',
        appliedDate: new Date('2025-06-28'),
        notes: 'Networking contact referred me to the team.'
      }
    }),
    prisma.application.create({
      data: {
        userId: user.id,
        company: 'Morgan Stanley',
        department: 'M&A Advisory',
        position: 'Investment Banking Analyst',
        status: 'INTERVIEW',
        appliedDate: new Date('2025-06-25'),
        notes: 'Strong technical interview performance.'
      }
    }),
    prisma.application.create({
      data: {
        userId: user.id,
        company: 'Lazard',
        department: 'Restructuring',
        position: 'Restructuring Analyst',
        status: 'OFFER',
        appliedDate: new Date('2025-06-20'),
        notes: 'Received offer! Negotiating terms.'
      }
    }),
  ])
  console.log(`✅ Created ${applications.length} applications`)

  // Create interviews
  const interviews = await Promise.all([
    prisma.interview.create({
      data: {
        userId: user.id,
        applicationId: applications[2].id, // Morgan Stanley
        company: 'Morgan Stanley',
        interviewType: 'TECHNICAL',
        role: 'IBD Technical — Round 2',
        scheduledDate: new Date('2025-07-06'), // Tomorrow
        scheduledTime: '2:00 PM',
        status: 'SCHEDULED',
        notes: 'Focus on DCF modeling and LBO analysis'
      }
    }),
    prisma.interview.create({
      data: {
        userId: user.id,
        company: 'KKR',
        interviewType: 'BEHAVIORAL',
        role: 'Private Equity — Behavioral',
        scheduledDate: new Date('2025-07-10'),
        scheduledTime: '10:00 AM',
        status: 'SCHEDULED',
        notes: 'Prepare STAR method examples'
      }
    }),
    prisma.interview.create({
      data: {
        userId: user.id,
        company: 'Evercore',
        interviewType: 'CASE_STUDY',
        role: 'Restructuring — Case Study',
        scheduledDate: new Date('2025-07-11'),
        scheduledTime: '4:30 PM',
        status: 'SCHEDULED',
        notes: 'Review distressed debt scenarios'
      }
    }),
    prisma.interview.create({
      data: {
        userId: user.id,
        applicationId: applications[0].id, // JPM
        company: 'J.P. Morgan',
        interviewType: 'BEHAVIORAL',
        role: 'IBD Behavioral Interview',
        scheduledDate: new Date('2025-06-30'),
        scheduledTime: '11:00 AM',
        status: 'COMPLETED',
        score: 85,
        notes: 'Strong performance, moving to final round'
      }
    }),
    prisma.interview.create({
      data: {
        userId: user.id,
        company: 'Centerview Partners',
        interviewType: 'TECHNICAL',
        role: 'IBD Technical Interview',
        scheduledDate: new Date('2025-06-28'),
        scheduledTime: '3:00 PM',
        status: 'COMPLETED',
        score: 78,
        notes: 'Need to improve on accretion/dilution analysis'
      }
    }),
  ])
  console.log(`✅ Created ${interviews.length} interviews`)

  // Create practice scores
  const practiceScores = await Promise.all([
    // Recent scores for dashboard
    ...Array.from({ length: 15 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return prisma.practiceScore.create({
        data: {
          userId: user.id,
          category: ['technical', 'behavioral', 'case_study'][Math.floor(Math.random() * 3)],
          score: 70 + Math.random() * 25, // Scores between 70-95
          date,
          notes: `Practice session ${i + 1} completed`
        }
      })
    })
  ])
  console.log(`✅ Created ${practiceScores.length} practice scores`)

  // Create courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'DCF Modeling Fundamentals',
        description: 'Learn to build comprehensive DCF models from scratch',
        category: 'technical',
        difficulty: 'INTERMEDIATE',
        duration: 120
      }
    }),
    prisma.course.create({
      data: {
        title: 'LBO Analysis Deep Dive',
        description: 'Master leveraged buyout modeling and analysis',
        category: 'technical',
        difficulty: 'ADVANCED',
        duration: 180
      }
    }),
    prisma.course.create({
      data: {
        title: 'Behavioral Interview Mastery',
        description: 'STAR method and banking-specific behavioral questions',
        category: 'behavioral',
        difficulty: 'BEGINNER',
        duration: 90
      }
    }),
    prisma.course.create({
      data: {
        title: 'M&A Transaction Analysis',
        description: 'Understand M&A processes, valuation, and deal structures',
        category: 'technical',
        difficulty: 'INTERMEDIATE',
        duration: 150
      }
    }),
  ])
  console.log(`✅ Created ${courses.length} courses`)

  // Create course progress (8/24 completed as shown on dashboard)
  const courseProgress = await Promise.all([
    ...courses.slice(0, 2).map((course, index) => 
      prisma.courseProgress.create({
        data: {
          userId: user.id,
          courseId: course.id,
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000)
        }
      })
    ),
    ...courses.slice(2).map(course => 
      prisma.courseProgress.create({
        data: {
          userId: user.id,
          courseId: course.id,
          status: 'IN_PROGRESS',
          progress: Math.floor(Math.random() * 80) + 10 // 10-90% progress
        }
      })
    )
  ])
  console.log(`✅ Created ${courseProgress.length} course progress records`)

  // Create weekly activity logs
  const activityLogs = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i)) // Last 7 days
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const hours = [2.5, 4.0, 3.2, 5.1, 3.8, 6.4, 4.6][i]
      const sessions = [3, 5, 4, 6, 4, 7, 5][i]
      
      return prisma.activityLog.create({
        data: {
          userId: user.id,
          date,
          hours,
          sessions,
          category: 'practice'
        }
      })
    })
  )
  console.log(`✅ Created ${activityLogs.length} activity logs`)

  // Create networking contacts
  const networkingContacts = await Promise.all([
    prisma.networkingContact.create({
      data: {
        userId: user.id,
        name: 'Sarah Chen',
        company: 'Goldman Sachs',
        position: 'VP, Investment Banking',
        email: 'sarah.chen@gs.com',
        linkedin: 'linkedin.com/in/sarahchen',
        status: 'RESPONDED',
        lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: 'Alumni from same university. Very helpful with industry insights.'
      }
    }),
    prisma.networkingContact.create({
      data: {
        userId: user.id,
        name: 'Michael Rodriguez',
        company: 'J.P. Morgan',
        position: 'Associate, M&A',
        email: 'michael.rodriguez@jpm.com',
        status: 'MEETING_SCHEDULED',
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Coffee meeting scheduled for next week. Interested in restructuring.'
      }
    }),
    prisma.networkingContact.create({
      data: {
        userId: user.id,
        name: 'Emily Watson',
        company: 'Morgan Stanley',
        position: 'Director, Coverage',
        linkedin: 'linkedin.com/in/emilywatson',
        status: 'NO_RESPONSE',
        lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        notes: 'Reached out via LinkedIn. No response yet - need follow up.'
      }
    }),
  ])
  console.log(`✅ Created ${networkingContacts.length} networking contacts`)

  // Create market insights
  const marketInsights = await Promise.all([
    prisma.marketInsight.create({
      data: {
        title: 'Q2 2024 M&A League Tables',
        category: 'league_tables',
        content: JSON.stringify({
          rankings: [
            { rank: 1, firm: 'Goldman Sachs', dealValue: 125.6, dealCount: 43 },
            { rank: 2, firm: 'J.P. Morgan', dealValue: 118.2, dealCount: 51 },
            { rank: 3, firm: 'Morgan Stanley', dealValue: 95.3, dealCount: 38 }
          ]
        }),
        dateRange: 'Q2 2024'
      }
    }),
    prisma.marketInsight.create({
      data: {
        title: 'Investment Banking Hiring Trends 2024',
        category: 'hiring_trends',
        content: JSON.stringify({
          trends: [
            'Increased focus on technology sector coverage',
            'Growing demand for ESG expertise',
            'Remote work flexibility becoming standard'
          ]
        }),
        dateRange: '2024'
      }
    })
  ])
  console.log(`✅ Created ${marketInsights.length} market insights`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during database seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })