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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paid } = body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        paid: Boolean(paid),
      },
    });

    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error("PATCH /api/invoices/[id] error:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}
