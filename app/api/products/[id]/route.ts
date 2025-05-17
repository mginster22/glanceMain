import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: parsedId },
    include: { characteristic: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
