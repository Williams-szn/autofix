import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (id === session.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own admin account" },
        { status: 400 }
      );
    }

    // Delete user assignments
    await prisma.jobAssignment.deleteMany({
      where: { mechanicId: id },
    });

    // Delete user vehicles and related repair jobs/diagnoses
    const vehicles = await prisma.vehicle.findMany({ where: { ownerId: id } });
    for (const v of vehicles) {
      const jobs = await prisma.repairJob.findMany({ where: { vehicleId: v.id } });
      for (const j of jobs) {
        await prisma.jobAssignment.deleteMany({ where: { repairJobId: j.id } });
        await prisma.diagnosis.deleteMany({ where: { repairJobId: j.id } });
        await prisma.jobPart.deleteMany({ where: { repairJobId: j.id } });
        await prisma.invoice.deleteMany({ where: { repairJobId: j.id } });
        await prisma.repairJob.delete({ where: { id: j.id } });
      }
      await prisma.vehicle.delete({ where: { id: v.id } });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
