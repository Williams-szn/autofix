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
      whereClause.repairJob = {
        vehicle: { ownerId: session.userId },
      };
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        repairJob: {
          include: {
            vehicle: {
              include: { owner: true },
            },
            partsUsed: {
              include: { part: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { repairJobId, laborCost = 10000 } = body;

    if (!repairJobId) {
      return NextResponse.json({ error: "repairJobId is required" }, { status: 400 });
    }

    const job = await prisma.repairJob.findUnique({
      where: { id: repairJobId },
      include: {
        partsUsed: { include: { part: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Repair job not found" }, { status: 404 });
    }

    const partsTotal = job.partsUsed.reduce((sum, item) => {
      return sum + item.part.price * item.quantity;
    }, 0);

    const totalAmount = partsTotal + parseFloat(laborCost);

    const invoice = await prisma.invoice.upsert({
      where: { repairJobId },
      update: {
        amount: totalAmount,
      },
      create: {
        repairJobId,
        amount: totalAmount,
        paid: false,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
