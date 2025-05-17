import { PrismaClient, Prisma } from "../app/generated/prisma";
import { products } from "@/shared/components/constants/products";
import { hashSync } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  for (const item of products) {
    const { characteristic, ...productData } = item;

    await prisma.product.create({
      data: {
        ...productData,
        img: item.img,
        newModel: item.newModel ?? false,
        discount: item.discount ?? 0,
        ...(characteristic && {
          characteristic: {
            create: {
              screen: characteristic.screen,
              cores: characteristic.cores,
              power: characteristic.power,
              ram: characteristic.ram,
              rom: characteristic.rom,
              camera: characteristic.camera,
            },
          },
        }),
      },
    });
  }

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashSync("11111", 10), // здесь должен быть хэш
      image: null,
    },
  });
}

main()
  .then(() => console.log("✅ База данных успешно заполнена."))
  .catch((e) => console.error("❌ Ошибка при заполнении:", e))
  .finally(async () => await prisma.$disconnect());
