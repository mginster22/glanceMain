import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// --- Helper Function for User Authentication ---
// ❗ Replace this with your actual user identification logic.
// This is a placeholder and NOT secure for production.
async function getUserIdFromRequest(req: NextRequest): Promise<number | null> {
  // Example: Get user ID from a custom header. In a real app, you'd likely use
  // a session token (e.g., from NextAuth.js) or a decoded JWT.
  const userIdHeader = req.cookies.get('cartToken')?.value;
  if (userIdHeader) {
    const userId = parseInt(userIdHeader, 10);
    return !isNaN(userId) ? userId : null;
  }
  // Example with NextAuth.js (you would need to set up NextAuth.js):
  // import { getServerSession } from "next-auth/next"
  // import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Adjust path to your authOptions
  // const session = await getServerSession(authOptions);
  // if (session?.user?.id) { // Assuming your session user object has an 'id' property
  //   return parseInt(session.user.id as string); // Ensure it's parsed to a number
  // }
  return null;
}

/**
 * @swagger
 * /api/favorite:
 * post:
 * summary: Add a product to favorites
 * description: Adds a specified product to the authenticated user's favorites list.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * productId:
 * type: integer
 * description: The ID of the product to add to favorites.
 * example: 1
 * responses:
 * 201:
 * description: Product added to favorites successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/FavoriteItem'
 * 400:
 * description: Bad request (e.g., missing productId, invalid productId).
 * 401:
 * description: Unauthorized (user not authenticated).
 * 404:
 * description: Product not found.
 * 409:
 * description: Product already in favorites.
 * 500:
 * description: Internal server error.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: 'Пользователь не авторизован' }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json({ message: 'Необходим productId (число)' }, { status: 400 });
    }

    // Проверка, существует ли продукт
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      return NextResponse.json({ message: 'Продукт не найден' }, { status: 404 });
    }

    // Проверка, не добавлен ли товар уже в избранное
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: { // Это имя составного уникального ключа, определенного в схеме @@unique([userId, productId])
          userId: userId,
          productId: productId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json({ message: 'Товар уже в избранном' }, { status: 409 });
    }

    // Добавление товара в избранное
    const newFavorite = await prisma.favorite.create({
      data: {
        userId: userId,
        productId: productId,
      },
      include: { // Включаем данные о продукте в ответ
        product: true,
      },
    });

    return NextResponse.json(newFavorite, { status: 201 });

  } catch (error: any) {
    console.error('Ошибка при добавлении в избранное:', error);
    if (error.code === 'P2002') { // Код ошибки Prisma для нарушения уникального ограничения
        return NextResponse.json({ message: 'Товар уже в избранном (P2002)' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Внутренняя ошибка сервера', error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/favorite:
 * get:
 * summary: Get user's favorite products
 * description: Retrieves all favorite products for the authenticated user.
 * responses:
 * 200:
 * description: A list of favorite products.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/FavoriteItemWithProduct'
 * 401:
 * description: Unauthorized (user not authenticated).
 * 500:
 * description: Internal server error.
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: 'Пользователь не авторизован' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true, // Включаем полную информацию о продукте
      },
      orderBy: {
        createdAt: 'desc', // Сортируем по дате добавления (новые сверху)
      }
    });

    return NextResponse.json(favorites, { status: 200 });

  } catch (error: any) {
    console.error('Ошибка при получении избранного:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера', error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/favorite:
 * delete:
 * summary: Remove a product from favorites
 * description: Removes a specified product from the authenticated user's favorites list.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * productId:
 * type: integer
 * description: The ID of the product to remove from favorites.
 * example: 1
 * responses:
 * 200:
 * description: Product removed from favorites successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Товар удален из избранного
 * 400:
 * description: Bad request (e.g., missing productId).
 * 401:
 * description: Unauthorized (user not authenticated).
 * 404:
 * description: Favorite item not found or product not found.
 * 500:
 * description: Internal server error.
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: 'Пользователь не авторизован' }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json({ message: 'Необходим productId (число)' }, { status: 400 });
    }

    // Проверка, существует ли такой элемент в избранном
    const favoriteItem = await prisma.favorite.findUnique({
        where: {
            userId_productId: {
                userId: userId,
                productId: productId,
            }
        }
    });

    if (!favoriteItem) {
        return NextResponse.json({ message: 'Товар не найден в избранном' }, { status: 404 });
    }

    // Удаление товара из избранного
    await prisma.favorite.delete({
      where: {
        id: favoriteItem.id, // Удаляем по ID записи в таблице Favorite
        // Либо можно использовать составной ключ, если бы Prisma это поддерживала напрямую в delete без предварительного поиска id
        // userId_productId: {
        //   userId: userId,
        //   productId: productId,
        // },
      },
    });

    return NextResponse.json({ message: 'Товар удален из избранного' }, { status: 200 });

  } catch (error: any) {
    console.error('Ошибка при удалении из избранного:', error);
    // P2025: Record to delete not found
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Товар не найден в избранном для удаления' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Внутренняя ошибка сервера', error: error.message }, { status: 500 });
  }
}

/*
// --- Дополнительные определения для Swagger (если вы используете генерацию API документации) ---
// Поместите это в отдельный файл или в секцию components вашего Swagger/OpenAPI документа.
components:
  schemas:
    FavoriteItem:
      type: object
      properties:
        id:
          type: integer
        userId:
          type: integer
        productId:
          type: integer
        createdAt:
          type: string
          format: date-time
        product:
          $ref: '#/components/schemas/Product' # Ссылка на вашу схему Product
    FavoriteItemWithProduct:
      type: object
      properties:
        id:
          type: integer
        userId:
          type: integer
        productId:
          type: integer
        createdAt:
          type: string
          format: date-time
        product:
          $ref: '#/components/schemas/Product' # Убедитесь, что у вас есть схема Product
    Product: // Примерная схема Product, адаптируйте под свою модель
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        brand:
          type: string
        model:
          type: string
        price:
          type: integer
        // ... другие поля продукта
*/
