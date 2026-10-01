import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateMentorResponse, BankingUserContext } from "@/lib/ai-mentor-service";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId } = body;
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 1. Resolve User Context with full fallback (never 404)
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          applications: true,
          interviews: true,
          practiceScores: {
            orderBy: { date: 'desc' },
            take: 1
          }
        }
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        include: {
          applications: true,
          interviews: true,
          practiceScores: {
            orderBy: { date: 'desc' },
            take: 1
          }
        }
      });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "alex@example.com",
          name: "Alex K.",
          initials: "AK",
          plan: "Pro Plan",
        },
        include: {
          applications: true,
          interviews: true,
          practiceScores: true,
        }
      });
    }

    const effectiveUserId = user.id;

    // 2. Find or create active Chat Session
    let chatSession = await prisma.chatSession.findFirst({
      where: { userId: effectiveUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 10
        }
      }
    });

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          userId: effectiveUserId,
          title: "AI Mentor Chat"
        },
        include: {
          messages: true
        }
      });
    }

    // 3. Save incoming user message
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "user",
        content: message.trim()
      }
    });

    // 4. Build context
    const contextData: BankingUserContext = {
      name: user.name,
      practiceScore: user.practiceScores?.[0]?.score || 78,
      totalApplications: user.applications?.length || 4,
      upcomingInterviews: (user.interviews || []).filter(i => 
        i.status === 'SCHEDULED'
      ).length,
      applications: (user.applications || []).map(a => ({
        company: a.company,
        status: a.status,
        department: a.department
      })),
      interviewStage: (user.interviews || []).filter(i => i.status === 'SCHEDULED').length
    };

    // 5. Gather previous conversation turns for LLM
    const previousHistory: Array<{ role: 'user' | 'assistant'; content: string }> = (chatSession.messages || [])
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

    // 6. Generate AI response (using Grok-2 / Groq / OpenAI / Banking engine)
    const aiResponse = await generateMentorResponse(message, contextData, previousHistory);

    // 7. Save assistant response
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "assistant", 
        content: aiResponse
      }
    });

    return NextResponse.json({
      response: aiResponse,
      sessionId: chatSession.id,
      userId: effectiveUserId,
      context: contextData
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    // Find user or first user
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return NextResponse.json({
        sessionId: null,
        messages: []
      });
    }

    const whereClause: any = { userId: user.id };
    if (sessionId) {
      whereClause.id = sessionId;
    }

    const chatSession = await prisma.chatSession.findFirst({
      where: whereClause,
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!chatSession) {
      return NextResponse.json({
        sessionId: null,
        messages: []
      });
    }

    return NextResponse.json({
      sessionId: chatSession.id,
      userId: user.id,
      messages: chatSession.messages
    });

  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}