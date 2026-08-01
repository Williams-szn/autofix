import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let whereClause: any = {};

    if (session.role === "CUSTOMER") {
      whereClause.vehicle = { ownerId: session.userId };
    } else if (session.role === "MECHANIC") {
      whereClause.assignments = {
        some: { mechanicId: session.userId },
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { vehicle: { make: { contains: search, mode: "insensitive" } } },
        { vehicle: { model: { contains: search, mode: "insensitive" } } },
        { vehicle: { registrationNo: { contains: search, mode: "insensitive" } } },
        { vehicle: { owner: { firstName: { contains: search, mode: "insensitive" } } } },
        { vehicle: { owner: { lastName: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const jobs = await prisma.repairJob.findMany({
      where: whereClause,
      include: {
        vehicle: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        assignments: {
          include: {
            mechanic: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        diagnosis: true,
        invoice: true,
        partsUsed: {
          include: {
            part: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch repair jobs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "CUSTOMER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, vehicleId, mechanicId } = body;

    if (!title || !vehicleId) {
      return NextResponse.json(
        { error: "Title and Vehicle are required" },
        { status: 400 }
      );
    }

    const newJob = await prisma.repairJob.create({
      data: {
        title,
        description: description || "Routine Inspection / Service",
        status: "PENDING",
        vehicleId,
        ...(mechanicId
          ? {
              assignments: {
                create: {
                  mechanicId,
                },
              },
            }
          : {}),
      },
      include: {
        vehicle: {
          include: {
            owner: true,
          },
        },
        assignments: {
          include: {
            mechanic: true,
          },
        },
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to create repair job" }, { status: 500 });
  }
}
