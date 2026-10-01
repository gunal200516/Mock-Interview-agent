import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';

    // Get user with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        applications: {
          orderBy: { appliedDate: 'desc' },
          take: 10
        },
        interviews: {
          where: {
            scheduledDate: {
              gte: new Date()
            }
          },
          orderBy: { scheduledDate: 'asc' },
          take: 5
        },
        practiceScores: {
          orderBy: { date: 'desc' },
          take: 1
        },
        courseProgress: {
          include: {
            course: true
          }
        },
        networkingContacts: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalApplications = user.applications.length;
    const totalInterviews = await prisma.interview.count({
      where: { userId }
    });
    const upcomingInterviews = user.interviews.length;
    const currentPracticeScore = user.practiceScores[0]?.score || 0;
    
    const completedCourses = user.courseProgress.filter(cp => cp.status === 'COMPLETED').length;
    const totalCourses = await prisma.course.count();

    // Get weekly activity
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyActivity = await prisma.activityLog.findMany({
      where: {
        userId,
        date: {
          gte: weekAgo
        }
      },
      orderBy: { date: 'asc' }
    });

    // Format weekly activity data
    const activityByDay = weeklyActivity.reduce((acc, activity) => {
      const day = activity.date.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = { hours: 0, sessions: 0 };
      }
      acc[day].hours += activity.hours;
      acc[day].sessions += activity.sessions;
      return acc;
    }, {} as Record<string, { hours: number; sessions: number }>);

    // Generate 7 days of data
    const weeklyData: Array<{ day: string; hours: number; sessions: number }> = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = activityByDay[dateKey] || { hours: 0, sessions: 0 };
      
      weeklyData.push({
        day: days[(7 - i) % 7],
        hours: dayData.hours,
        sessions: dayData.sessions
      });
    }

    // Application status breakdown
    const applicationStats = user.applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        initials: user.initials,
        plan: user.plan
      },
      stats: [
        {
          id: "applications",
          label: "Applications",
          value: totalApplications.toString(),
          trend: `${applicationStats.APPLIED || 0} active`,
          trendPositive: (applicationStats.APPLIED || 0) > 0,
          icon: "briefcase",
          accent: "amber"
        },
        {
          id: "interviews",
          label: "Interviews", 
          value: totalInterviews.toString(),
          trend: `${upcomingInterviews} upcoming`,
          trendPositive: upcomingInterviews > 0,
          icon: "calendar",
          accent: "teal"
        },
        {
          id: "practice",
          label: "Practice Score",
          value: `${Math.round(currentPracticeScore)}%`,
          trend: "+12% vs last week",
          trendPositive: true,
          icon: "trending-up",
          accent: "green"
        },
        {
          id: "courses",
          label: "Courses Done",
          value: `${completedCourses}/${totalCourses}`,
          caption: `${Math.round((completedCourses / totalCourses) * 100)}% completion`,
          icon: "book-open",
          accent: "purple"
        }
      ],
      upcomingInterviews: user.interviews.map(interview => ({
        id: interview.id,
        company: interview.company,
        initials: interview.company.split(' ').map(w => w[0]).join('').slice(0, 3),
        role: interview.role,
        when: interview.scheduledDate.toLocaleDateString() === new Date(Date.now() + 86400000).toLocaleDateString() 
          ? 'Tomorrow' 
          : interview.scheduledDate.toLocaleDateString(),
        time: interview.scheduledTime,
        avatarAccent: ['purple', 'teal', 'amber'][Math.floor(Math.random() * 3)] as 'purple' | 'teal' | 'amber'
      })),
      recentApplications: user.applications.slice(0, 4).map(app => ({
        id: app.id,
        company: app.company,
        department: app.department,
        status: app.status,
        applied: app.appliedDate.toLocaleDateString()
      })),
      weeklyActivity: weeklyData,
      networkingContacts: user.networkingContacts.length,
      insights: [
        {
          type: upcomingInterviews > 0 ? 'urgent' : 'info',
          title: upcomingInterviews > 0 ? 
            `${upcomingInterviews} Interview${upcomingInterviews > 1 ? 's' : ''} This Week` : 
            'No Upcoming Interviews',
          description: upcomingInterviews > 0 ? 
            'Review your preparation materials and practice pitches' : 
            'Consider scheduling more mock interviews',
          priority: upcomingInterviews > 0 ? 'high' : 'medium'
        },
        {
          type: currentPracticeScore > 75 ? 'success' : 'warning',
          title: currentPracticeScore > 75 ? 
            'Strong Practice Performance!' : 
            'Practice Score Needs Improvement',
          description: currentPracticeScore > 75 ? 
            `${Math.round(currentPracticeScore)}% score shows excellent preparation` : 
            `Current ${Math.round(currentPracticeScore)}% - aim for 80%+`,
          priority: 'medium'
        }
      ]
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}