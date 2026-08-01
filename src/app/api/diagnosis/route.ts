import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "MECHANIC" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { repairJobId, findings, notes } = body;

    if (!repairJobId || !findings) {
      return NextResponse.json(
        { error: "Repair Job ID and findings are required" },
        { status: 400 }
      );
    }

    // Upsert diagnosis record
    const diagnosis = await prisma.diagnosis.upsert({
      where: { repairJobId },
      update: {
        findings,
        notes,
      },
      create: {
        repairJobId,
        findings,
        notes,
      },
    });

    // Optionally update repair status to DIAGNOSING if currently PENDING
    const job = await prisma.repairJob.findUnique({ where: { id: repairJobId } });
    if (job && job.status === "PENDING") {
      await prisma.repairJob.update({
        where: { id: repairJobId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json(diagnosis, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/diagnosis error:", error);
    return NextResponse.json(
      { error: "Failed to create/update diagnosis" },
      { status: 500 }
    );
  }
}