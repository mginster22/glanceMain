import prisma from '@/lib/prisma';
import { CreateOrderRequest } from '@/types/order';
import { NextRequest, NextResponse } from 'next/server';


// app/api/order/route.ts

export async function POST(req: Request) {
  try {
    const body = await req.json() as CreateOrderRequest;

    const { userId, items, total } = body;

    // Проверка наличия товара и количества
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Товар с id ${item.productId} не найден` },
          { status: 404 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Недостаточно товара "${product.name}" на складе. В наличии: ${product.quantity}, нужно: ${item.quantity}`,
          },
          { status: 400 }
        );
      }
    }

    // Транзакция: создать заказ + обновить остатки
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          orderItems: {
            createMany: {
              data: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity, // уменьшаем количество
            },
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Ошибка при создании заказа:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}




export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId && !token) {
      return NextResponse.json({ error: 'userId or token is required' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          userId ? { userId: Number(userId) } : undefined,
          token ? { token } : undefined,
        ].filter(Boolean) as any,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
