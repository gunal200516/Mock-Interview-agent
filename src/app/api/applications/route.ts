import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    let whereClause: any = { userId };
    if (status) {
      whereClause.status = status;
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        interviews: true
      },
      orderBy: { appliedDate: 'desc' },
      take: limit
    });

    return NextResponse.json(applications);

  } catch (error) {
    console.error("Applications GET error:", error);
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
    const { userId, company, department, position, status = 'APPLIED', notes } = data;

    if (!userId || !company || !department) {
      return NextResponse.json(
        { error: "userId, company, and department are required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        userId,
        company,
        department,
        position: position || `${department} Analyst`,
        status,
        notes,
        appliedDate: new Date()
      }
    });

    return NextResponse.json(application, { status: 201 });

  } catch (error) {
    console.error("Applications POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, status, notes } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Application id is required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(application);

  } catch (error) {
    console.error("Applications PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}