import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    // Используем findFirst с OR, на будущее можно добавить поиск по userId
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [
          { token },
          // Можно добавить { userId: ... } при наличии аутентификации
        ],
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    );

    const items = cart.cartItems.map((item) => ({
      ...item.product,
      productId: item.productId,
      selectedImg: item.product.img[0],
      count: item.quantity,
    }));

    return NextResponse.json({ totalAmount, items });
  } catch (error) {
    console.error("Ошибка при получении корзины:", error);
    return NextResponse.json(
      { error: "Не удалось получить данные корзины" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, count = 1 } = body;

    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Находим корзину по токену или создаем новую, если ее нет
    let cart = await prisma.cart.findUnique({ where: { token } });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          token,
          userId: null, // Для анонимного пользователя
        },
      });
    }

    // Проверяем, есть ли товар в корзине
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    // Получаем текущий остаток товара на складе
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    if (product.quantity < count) {
      return NextResponse.json(
        { error: "Недостаточно товара на складе" },
        { status: 400 }
      );
    }

    if (existingItem) {
      // Обновляем количество товара в корзине
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + count },
      });
    } else {
      // Добавляем новый товар в корзину
      await prisma.cartItem.create({
        data: {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: productId } },
          quantity: count,
        },
      });
    }

    // Уменьшаем количество товара на складе
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          decrement: count,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// В api/cart/route.ts
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = body;
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({ where: { token } });

    if (!cart) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Товар не найден в корзине" },
        { status: 404 }
      );
    }

    // Удаляем товар из корзины
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    // Возвращаем количество товара на склад
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          increment: item.quantity,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Ошибка при удалении из корзины:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// В api/cart/route.ts

export async function PATCH(req: NextRequest) {
  try {
    const { productId, count } = await req.json();
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({ where: { token } });
    if (!cart) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Товар не найден в корзине" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    const quantityChange = count - item.quantity;

    if (quantityChange > 0 && product.quantity < quantityChange) {
      return NextResponse.json(
        { error: "Недостаточно товара на складе" },
        { status: 400 }
      );
    }

    if (count <= 0) {
      // Удаляем товар из корзины и возвращаем на склад
      await prisma.cartItem.delete({ where: { id: item.id } });

      await prisma.product.update({
        where: { id: productId },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    } else {
      // Обновляем количество в корзине
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: count },
      });

      // Обновляем количество на складе в зависимости от разницы
      if (quantityChange > 0) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantity: {
              decrement: quantityChange,
            },
          },
        });
      } else if (quantityChange < 0) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantity: {
              increment: -quantityChange,
            },
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Ошибка при обновлении корзины:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
