import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Путь до настроек NextAuth
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { text, productId } = await req.json();

  if (!text || !productId) {
    return NextResponse.json(
      { message: "Missing text or productId" },
      { status: 400 }
    );
  }

  try {
    // Находим пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Создаём комментарий
    const comment = await prisma.comment.create({
      data: {
        text,
        productId: Number(productId),
        userId: user.id,
      },
      include: {
        user: true, // Чтобы вернуть имя, аватар и т.д.
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { productId: Number(productId) },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email:true
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
// app/api/comment/route.ts 

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await req.json();

  if (!commentId) {
    return NextResponse.json(
      { message: "Missing commentId" },
      { status: 400 }
    );
  }

  try {
    // Получаем комментарий из БД
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Проверяем, что автор комментария совпадает с текущим пользователем
    if (comment.user.email !== session.user.email) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Удаляем комментарий
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
