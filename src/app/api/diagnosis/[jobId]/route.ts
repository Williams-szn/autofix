import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const diagnosis = await prisma.diagnosis.findUnique({
      where: { repairJobId: jobId },
      include: {
        repairJob: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    if (!diagnosis) {
      return NextResponse.json({ error: "Diagnosis not found" }, { status: 404 });
    }

    return NextResponse.json(diagnosis);
  } catch (error: any) {
    console.error("GET /api/diagnosis/[jobId] error:", error);
    return NextResponse.json({ error: "Failed to fetch diagnosis" }, { status: 500 });
  }
}
