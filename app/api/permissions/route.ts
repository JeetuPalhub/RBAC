import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromReq, hasPermission } from "@/lib/auth";

// ➕ CREATE permission (Admin only)
export async function POST(req: Request) {
  try {
    const user = await getUserFromReq(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowed = await hasPermission(user.userId, "manage_permissions");
    if (!allowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Permission name is required" },
        { status: 400 }
      );
    }

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

// 📄 LIST permissions (any logged-in user)
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
