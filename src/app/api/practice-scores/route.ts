import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    let whereClause: any = { userId };
    if (category) {
      whereClause.category = category;
    }

    const practiceScores = await prisma.practiceScore.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit
    });

    // Calculate average scores by category
    const scoresByCategory = await prisma.practiceScore.groupBy({
      by: ['category'],
      where: { userId },
      _avg: {
        score: true
      },
      _count: {
        id: true
      }
    });

    const averageScore = await prisma.practiceScore.aggregate({
      where: { userId },
      _avg: {
        score: true
      }
    });

    return NextResponse.json({
      scores: practiceScores,
      categoryAverages: scoresByCategory,
      overallAverage: averageScore._avg.score || 0
    });

  } catch (error) {
    console.error("Practice scores GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, category, score, maxScore = 100, notes } = data;

    if (!userId || !category || score === undefined) {
      return NextResponse.json(
        { error: "userId, category, and score are required" },
        { status: 400 }
      );
    }

    if (score < 0 || score > maxScore) {
      return NextResponse.json(
        { error: `Score must be between 0 and ${maxScore}` },
        { status: 400 }
      );
    }

    const practiceScore = await prisma.practiceScore.create({
      data: {
        userId,
        category,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        notes,
        date: new Date()
      }
    });

    return NextResponse.json(practiceScore, { status: 201 });

  } catch (error) {
    console.error("Practice scores POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}