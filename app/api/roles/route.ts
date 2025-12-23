import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ➕ CREATE role
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Role name is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.role.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Role already exists" },
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: { name },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create role" },
      { status: 500 }
    );
  }
}

// 📄 LIST roles
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(roles);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
