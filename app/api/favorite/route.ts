import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { product: true },
      },
    },
  });

  return NextResponse.json(user?.favorites ?? []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { message: "Already in favorites" },
      { status: 200 }
    );
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: user.id,
      productId,
    },
  });

  return NextResponse.json(favorite);
}
