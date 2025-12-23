import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ➕ CREATE permission
export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Permission name is required" },
        { status: 400 }
      );
    }

    // avoid duplicate
    const existing = await prisma.permission.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Permission already exists" },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.create({
      data: { name, description },
    });

    return NextResponse.json(permission, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create permission" },
      { status: 500 }
    );
  }
}

// 📄 LIST permissions
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(permissions);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}
