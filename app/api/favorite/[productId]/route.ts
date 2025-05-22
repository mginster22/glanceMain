import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const productId = req.nextUrl.pathname.split("/").pop(); // получаем productId из URL

  if (!productId || isNaN(Number(productId))) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
  }

  const deleted = await prisma.favorite.deleteMany({
    where: {
      userId: user.id,
      productId: parseInt(productId),
    },
  });

  return NextResponse.json({ success: deleted.count > 0 });
}
