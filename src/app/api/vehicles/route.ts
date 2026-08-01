import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let whereClause: any = {};
    if (session.role === "CUSTOMER") {
      whereClause.ownerId = session.userId;
    }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vehicles);
  } catch (error: any) {
    console.error("GET /api/vehicles error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { make, model, year, registrationNo, vin, mileage, ownerId } = body;

    if (!make || !model || !year || !registrationNo) {
      return NextResponse.json(
        { error: "Make, model, year, and registration number are required" },
        { status: 400 }
      );
    }

    const targetOwnerId = session.role === "CUSTOMER" ? session.userId : ownerId || session.userId;

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        year: parseInt(year, 10),
        registrationNo,
        vin: vin || null,
        mileage: mileage ? parseInt(mileage, 10) : null,
        ownerId: targetOwnerId,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/vehicles error:", error);
    return NextResponse.json(
      { error: error.code === "P2002" ? "Registration number or VIN already exists" : "Failed to create vehicle" },
      { status: 400 }
    );
  }
}
