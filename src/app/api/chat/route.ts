import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mock AI responses - in production, this would connect to OpenAI/Claude API
const generateAIResponse = (message: string, userContext: any) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('dcf') || lowerMessage.includes('discounted cash flow')) {
    return `Great question about DCF modeling! Based on your current progress (${userContext.practiceScore}% practice score), here's a tailored explanation:

**DCF Model Components:**
1. **Revenue Projections** - Start with historical analysis
2. **Free Cash Flow** - EBITDA → EBIT → NOPAT → FCF  
3. **Terminal Value** - Exit multiple or perpetuity growth
4. **WACC Calculation** - Cost of equity + cost of debt

Since you have the Morgan Stanley interview tomorrow, focus on:
- Sensitivity analysis (±2% revenue growth, ±50bps WACC)
- Working capital impacts (often overlooked)
- Terminal value assumptions (usually 60-80% of enterprise value)

Want me to walk through a specific example?`;
  }
  
  if (lowerMessage.includes('behavioral') || lowerMessage.includes('interview')) {
    return `Perfect timing for behavioral prep! With your Morgan Stanley interview tomorrow, here are key questions to practice:

**Must-Know Questions:**
1. **"Tell me about yourself"** - 60-second pitch connecting background to IBD
2. **"Why investment banking?"** - Show genuine interest, not just prestige
3. **"Walk me through your resume"** - Connect experiences to banking skills
4. **"Time you worked under pressure"** - Use STAR method

**MS-Specific Tips:**
- Know recent MS deals (check their league table position)
- Understand their culture ("blue chip clients, white shoe culture")
- Prepare 2-3 questions about their specific groups

Ready to practice? I can simulate interview questions!`;
  }
  
  if (lowerMessage.includes('application') || lowerMessage.includes('strategy')) {
    return `Smart to think strategically! Based on your current applications (${userContext.totalApplications} submitted), here's optimization advice:

**Your Current Pipeline:**
- ${userContext.interviewStage} interviews scheduled
- ${userContext.applications.filter((a: any) => a.status === 'OFFER').length} offers received
- ${userContext.applications.filter((a: any) => a.status === 'APPLIED').length} pending responses

**Next Steps:**
1. **Follow up** on applications >1 week old
2. **Network** with alumni at target firms
3. **Expand** to 2-3 similar firms per target

Want me to analyze your specific target list?`;
  }
  
  // Default response
  return `Thanks for your question! Based on your profile (${userContext.practiceScore}% practice score, upcoming ${userContext.upcomingInterviews} interviews), I'm here to help with:

- **Technical prep** (DCF, LBO, M&A analysis)
- **Behavioral coaching** (STAR method, banking-specific questions)  
- **Application strategy** (targeting, networking, timing)
- **Interview prep** (company research, deal examples)

What specific area would you like to focus on?`;
};

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();
    
    if (!message || !userId) {
      return NextResponse.json(
        { error: "Message and userId are required" },
        { status: 400 }
      );
    }

    // Get user context for personalized responses
    const userContext = await prisma.user.findUnique({
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

    if (!userContext) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create chat session if it doesn't exist
    let chatSession = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          userId,
          title: "AI Mentor Chat"
        }
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "user",
        content: message
      }
    });

    // Generate context-aware response
    const contextData = {
      practiceScore: userContext.practiceScores[0]?.score || 0,
      totalApplications: userContext.applications.length,
      upcomingInterviews: userContext.interviews.filter(i => 
        i.status === 'SCHEDULED' && new Date(i.scheduledDate) > new Date()
      ).length,
      applications: userContext.applications,
      interviewStage: userContext.interviews.filter(i => i.status === 'SCHEDULED').length
    };

    const aiResponse = generateAIResponse(message, contextData);

    // Save AI response
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

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    let whereClause: any = { userId };
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
      return NextResponse.json([]);
    }

    return NextResponse.json({
      sessionId: chatSession.id,
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