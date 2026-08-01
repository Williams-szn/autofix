import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parts = await prisma.part.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(parts);
  } catch (error: any) {
    console.error("GET /api/parts error:", error);
    return NextResponse.json({ error: "Failed to fetch parts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, quantity, price } = body;

    if (!name || quantity === undefined || price === undefined) {
      return NextResponse.json(
        { error: "Name, quantity, and price are required" },
        { status: 400 }
      );
    }

    const part = await prisma.part.create({
      data: {
        name,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      },
    });

    return NextResponse.json(part, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/parts error:", error);
    return NextResponse.json({ error: "Failed to create part" }, { status: 500 });
  }
}