import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.repairJob.findUnique({
      where: { id },
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
        diagnosis: true,
        invoice: true,
        partsUsed: {
          include: {
            part: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error: any) {
    console.error("GET /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, mechanicId, title, description, partId, partQuantity } = body;

    const existingJob = await prisma.repairJob.findUnique({
      where: { id },
      include: { assignments: true },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Update status or basic details
    const updatedData: any = {};
    if (status) updatedData.status = status;
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;

    const updatedJob = await prisma.repairJob.update({
      where: { id },
      data: updatedData,
    });

    // Assign mechanic if provided
    if (mechanicId && session.role === "ADMIN") {
      // Remove old assignments and create new one
      await prisma.jobAssignment.deleteMany({
        where: { repairJobId: id },
      });
      await prisma.jobAssignment.create({
        data: {
          repairJobId: id,
          mechanicId,
        },
      });
    }

    // Attach part used if provided
    if (partId && partQuantity) {
      const quantityNum = parseInt(partQuantity, 10);
      const part = await prisma.part.findUnique({ where: { id: partId } });
      if (part) {
        if (part.quantity < quantityNum) {
          return NextResponse.json(
            { error: `Insufficient stock for ${part.name}. Only ${part.quantity} left.` },
            { status: 400 }
          );
        }

        // Deduct inventory stock
        await prisma.part.update({
          where: { id: partId },
          data: { quantity: part.quantity - quantityNum },
        });

        // Add to JobPart
        await prisma.jobPart.create({
          data: {
            repairJobId: id,
            partId,
            quantity: quantityNum,
          },
        });
      }
    }

    const fullJob = await prisma.repairJob.findUnique({
      where: { id },
      include: {
        vehicle: { include: { owner: true } },
        assignments: { include: { mechanic: true } },
        diagnosis: true,
        invoice: true,
        partsUsed: { include: { part: true } },
      },
    });

    return NextResponse.json(fullJob);
  } catch (error: any) {
    console.error("PATCH /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
