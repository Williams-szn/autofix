import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, quantity, price } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity, 10);
    if (price !== undefined) updateData.price = parseFloat(price);

    const updatedPart = await prisma.part.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPart);
  } catch (error: any) {
    console.error("PATCH /api/parts/[id] error:", error);
    return NextResponse.json({ error: "Failed to update part" }, { status: 500 });
  }
}

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

    // Delete associated JobPart references first if any
    await prisma.jobPart.deleteMany({
      where: { partId: id },
    });

    await prisma.part.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/parts/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete part" }, { status: 500 });
  }
}
