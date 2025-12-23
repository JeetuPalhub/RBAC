import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✏️ UPDATE role
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await req.json();

    const updated = await prisma.role.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update role" },
      { status: 500 }
    );
  }
}

// ❌ DELETE role
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Role deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to delete role" },
      { status: 500 }
    );
  }
}
