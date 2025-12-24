import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

// JWT se userId nikalna
export async function getUserFromReq(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// User ke paas specific permission hai ya nahi
export async function hasPermission(userId: string, perm: string) {
  const roles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  return roles.some((r) =>
    r.role.permissions.some((p) => p.permission.name === perm)
  );
}
