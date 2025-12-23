import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✏️ UPDATE
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description } = await req.json();

    const updated = await prisma.permission.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update permission" },
      { status: 500 }
    );
  }
}

// ❌ DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.permission.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Permission deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to delete permission" },
      { status: 500 }
    );
  }
}
