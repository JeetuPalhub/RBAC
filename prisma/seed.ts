import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const perms = ["manage_roles", "manage_permissions"];

  // Create permissions
  for (const p of perms) {
    await prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p },
    });
  }

  // Create Admin role
  const admin = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  // Assign all permissions to Admin
  const all = await prisma.permission.findMany();

  await prisma.rolePermission.deleteMany({
    where: { roleId: admin.id },
  });

  await prisma.rolePermission.createMany({
    data: all.map((perm) => ({
      roleId: admin.id,
      permissionId: perm.id,
    })),
  });

  console.log("✅ Admin role & permissions seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
