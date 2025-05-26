import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// ======= Заглушка: функция получения userId из запроса (замени под свою аутентификацию) =======
export async function getUserId(req: Request): Promise<number | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  // Если session.user.id — строка, то нужно её явно преобразовать в число
  const userId =
    typeof session.user.id === "string"
      ? parseInt(session.user.id, 10)
      : session.user.id;

  if (Number.isNaN(userId)) {
    return null;
  }

  return userId;
}

// ======= Функция слияния корзин: анонимной по token и пользовательской по userId =======
export async function mergeCarts(userId: number, token: string | undefined) {
  if (!token) return;

  const anonymousCart = await prisma.cart.findFirst({
    where: { token },
    include: { cartItems: true },
  });
  if (!anonymousCart) return;

  let userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { cartItems: true },
  });

  if (!userCart) {
    // Если token обязателен, надо добавить какой-то фиктивный token или сделать поле опциональным в схеме
    userCart = await prisma.cart.create({
      data: { userId, token: "" },
      include: { cartItems: true },
    });
  }

  for (const item of anonymousCart.cartItems) {
    const existingItem = userCart.cartItems.find(
      (i) => i.productId === item.productId
    );
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  }

  await prisma.cartItem.deleteMany({ where: { cartId: anonymousCart.id } });
  await prisma.cart.delete({ where: { id: anonymousCart.id } });

  return userCart;
}

// ======= GET - Получить корзину =======

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    const token = req.cookies.get("cartToken")?.value;

    if (userId) {
      // Если авторизован — сливаем анонимную корзину (если есть)
      if (token) {
        await mergeCarts(userId, token);
        // Можно вернуть флаг для удаления cookie cartToken
      }

      let cart = await prisma.cart.findFirst({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: { cartItems: { include: { product: true } } },
        });
      }

      if (cart.cartItems.length === 0) {
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
    } else {
      // Анонимный пользователь — корзина по токену
      if (!token) {
        return NextResponse.json({ totalAmount: 0, items: [] });
      }

      const cart = await prisma.cart.findFirst({
        where: { token },
        include: { cartItems: { include: { product: true } } },
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
    }
  } catch (error) {
    console.error("Ошибка при получении корзины:", error);
    return NextResponse.json(
      { error: "Не удалось получить данные корзины" },
      { status: 500 }
    );
  }
}


// ======= POST - Добавить товар в корзину =======
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, count = 1 } = body;

    const userId = await getUserId(req);
    const token = req.cookies.get("cartToken")?.value;

    // Определяем корзину
    let cart;

    if (userId) {
      // Для авторизованного пользователя ищем или создаем корзину по userId
      cart = await prisma.cart.findFirst({
        where: { userId },
        include: { cartItems: true },
      });

      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }

      // Если есть анонимный токен — сливаем корзины и удаляем токен (фронт должен удалить cookie)
      if (token) {
        await mergeCarts(userId, token);
      }
    } else {
      // Для анонимного пользователя используем token
      if (!token) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
      }

      cart = await prisma.cart.findFirst({ where: { token } });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            token,
            userId: null,
          },
        });
      }
    }

    // Проверяем наличие товара
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

    // Проверяем, есть ли товар в корзине
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + count },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
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

// ======= DELETE - Удалить товар из корзины или очистить корзину =======
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { productId } = body;

    const userId = await getUserId(req);
    const token = req.cookies.get("cartToken")?.value;

    let cart;

    if (userId) {
      cart = await prisma.cart.findFirst({ where: { userId } });
    } else if (token) {
      cart = await prisma.cart.findFirst({ where: { token } });
    } else {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (!cart) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }

    if (!productId) {
      // Очистить корзину, вернуть товары на склад
      const items = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
      });

      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }

      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      return NextResponse.json({ success: true, message: "Корзина очищена" });
    }

    // Удалить конкретный товар из корзины
    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Товар не найден в корзине" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({ where: { id: item.id } });

    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          increment: item.quantity,
        },
      },
    });

    return NextResponse.json({ success: true, message: "Товар удалён" });
  } catch (error) {
    console.error("Ошибка при удалении из корзины:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// ======= PATCH - Обновить количество товара в корзине =======

export async function PATCH(req: NextRequest) {
  try {
    const { productId, count } = await req.json();

    const userId = await getUserId(req);
    const token = req.cookies.get("cartToken")?.value;

    let cart;

    if (userId) {
      cart = await prisma.cart.findFirst({ where: { userId } });
    } else if (token) {
      cart = await prisma.cart.findFirst({ where: { token } });
    } else {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

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
      // Удаляем товар из корзины и возвращаем количество на склад
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

      // Обновляем количество товара на складе в зависимости от изменения количества в корзине
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
  } catch (error) {
    console.error("Ошибка при обновлении корзины:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
