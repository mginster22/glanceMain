"use client";

import React, { useEffect } from "react";
import { Button, Title } from "@/shared/components/ui";
import { Container } from "@/shared/components";
import { cn } from "@/shared/components/libs";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCart";
import { useProductStore } from "@/store/useProduct";
import { Loader2 } from "lucide-react";

interface Props {
  productId: number;
  className?: string;
}

export const ProductInfoBlock: React.FC<Props> = ({ productId, className }) => {
  const { addToCart, cart,loading } = useCartStore();
  const { singleProduct, fetchProductById } = useProductStore();

  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById, cart]);

  console.log(singleProduct);

  if (!singleProduct) {
    return (
      <Container
        className={cn("mt-4 flex flex-col max-sm:pb-40 max-sm:px-4", className)}
      >
        <Title text="Карточка товара" size="md" />
        <p className="text-xl text-red-500">Товар не найден</p>
      </Container>
    );
  }

  const availableQuantity = singleProduct.quantity ?? 0;

  return (
    <Container
      className={cn("mt-4 flex flex-col max-sm:pb-40 max-sm:px-4", className)}
    >
      <Title text="Карточка товара" size="md" />
      <div className="flex justify-between max-sm:flex-col">
        <img
          src={singleProduct.img[0]}
          alt={`${singleProduct.name} ${singleProduct.brand} ${singleProduct.model}`}
          className="w-[400px] h-[500px] object-contain max-sm:w-[200px] max-sm:h-[200px]"
        />
        <div className="w-[350px]">
          <p className="text-[32px] max-sm:text-[20px]">
            {singleProduct.name} {singleProduct.brand} {singleProduct.model}{" "}
            {singleProduct.memory}
          </p>
          <span className="font-light">Цвет белый</span>

          {singleProduct.characteristic && (
            <div className="flex flex-col text-xl max-sm:text-sm max-sm:gap-3 gap-9">
              <span className="text-2xl">Характеристики:</span>
              <p className="font-light">
                Экран: {singleProduct.characteristic.screen}
              </p>
              <p className="font-light">
                Количество ядер: {singleProduct.characteristic.cores}
              </p>
              <p className="font-light">
                Мощность блока питания: {singleProduct.characteristic.power}
              </p>
              <p className="font-light">
                Оперативная память (RAM): {singleProduct.characteristic.ram}
              </p>
              <p className="font-light">
                Встроенная память (ROM): {singleProduct.characteristic.rom}
              </p>
              <p className="font-light">
                Основная камера МПикс: {singleProduct.characteristic.camera}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center bg-[#E7E7ED] max-w-[300px] w-full max-h-[200px] py-8">
          <div className="flex items-end gap-2">
            {singleProduct.discount ? (
              <>
                <span className="font-bold text-[20px]">
                  {Math.round(
                    singleProduct.price *
                      (1 - (singleProduct.discount ?? 0) / 100)
                  )}{" "}
                  грн
                </span>
                <span className="font-light text-[15px] line-through">
                  {singleProduct.price} грн
                </span>
              </>
            ) : (
              <span className="font-bold text-[20px]">
                {singleProduct.price} грн
              </span>
            )}
          </div>

          <Button
            className="..." // стили
            onClick={async () => {
              if (availableQuantity > 0) {
                try {
                  await addToCart(singleProduct.id, 1);
                  toast.success("Товар добавлен в корзину");
                } catch {
                  toast.error("Ошибка при добавлении в корзину");
                }
              } else {
                toast.error("Товара нет в наличии");
              }
            }}
            disabled={availableQuantity === 0 || loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              "В корзину"
            )}
          </Button>

          <div>
            {availableQuantity > 0 ? (
              <span className="text-[#169B00] text-[16px]">В наличии</span>
            ) : (
              <span className="text-red-400 text-[16px]">Товар закончился</span>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
