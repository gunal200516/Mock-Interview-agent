import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    let whereClause: any = { userId };
    if (status) {
      whereClause.status = status;
    }

    const contacts = await prisma.networkingContact.findMany({
      where: whereClause,
      orderBy: { lastContact: 'desc' },
      take: limit
    });

    // Get statistics
    const stats = await prisma.networkingContact.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      contacts,
      stats: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.id;
        return acc;
      }, {} as Record<string, number>)
    });

  } catch (error) {
    console.error("Networking GET error:", error);
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
    const { 
      userId, 
      name, 
      company, 
      position, 
      email, 
      linkedin, 
      status = 'REACHED_OUT', 
      notes 
    } = data;

    if (!userId || !name || !company) {
      return NextResponse.json(
        { error: "userId, name, and company are required" },
        { status: 400 }
      );
    }

    const contact = await prisma.networkingContact.create({
      data: {
        userId,
        name,
        company,
        position,
        email,
        linkedin,
        status,
        notes,
        lastContact: new Date()
      }
    });

    return NextResponse.json(contact, { status: 201 });

  } catch (error) {
    console.error("Networking POST error:", error);
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
        { error: "Contact id is required" },
        { status: 400 }
      );
    }

    const contact = await prisma.networkingContact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        lastContact: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(contact);

  } catch (error) {
    console.error("Networking PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}