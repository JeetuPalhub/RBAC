import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔗 ASSIGN permissions to a role
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roleId } = await params;
    const { permissionIds } = await req.json(); // string[]

    if (!Array.isArray(permissionIds)) {
      return NextResponse.json(
        { message: "permissionIds must be an array" },
        { status: 400 }
      );
    }

    // delete old mappings
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // create new mappings
    await prisma.rolePermission.createMany({
      data: permissionIds.map((pid: string) => ({
        roleId,
        permissionId: pid,
      })),
    });

    return NextResponse.json({ message: "Permissions assigned to role" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to assign permissions" },
      { status: 500 }
    );
  }
}

// 📄 GET permissions of a role
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roleId } = await params;

    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { message: "Role not found" },
        { status: 404 }
      );
    }

    const permissions = role.permissions.map((rp) => rp.permission);

    return NextResponse.json({
      id: role.id,
      name: role.name,
      permissions,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch role permissions" },
      { status: 500 }
    );
  }
}
