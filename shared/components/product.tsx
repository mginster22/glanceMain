"use client";
import { CircleSmall, Heart, Loader, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "./ui";
import { cn } from "./libs";
import { ProductItem } from "@/types/products";
import Link from "next/link";
import { useProductStore } from "@/store/useProduct";
import { useCartStore } from "@/store/useCart";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  item: ProductItem;
  productMobileClassCart?: boolean;
}

export const Product: React.FC<Props> = ({
  className,
  item,
  productMobileClassCart,
}) => {
  const { addToCart } = useCartStore((state) => state);
  const [loadingCart, setLoadingCart] = React.useState(false);

  const {loading} =useCartStore((state) => state);

  const productInStore = useProductStore((state) =>
    state.products.find((p) => p.id === item.id)
  );
  const availableQuantity = productInStore?.quantity ?? item.quantity ?? 0;
  const [currentImgIndex, setCurrentImgIndex] = React.useState<
    Record<number, number>
  >({});

  const currentIndex = currentImgIndex[item.id] ?? 0;
  const handleImageChange = (id: number, index: number) => {
    setCurrentImgIndex((prev) => ({ ...prev, [id]: index }));
  };

  return (
    
    <div
      className={cn(
        " relative flex flex-col gap-4 justify-between mr-2  shadowcustom px-2 py-2 rounded-xl w-[217px] max-sm:w-[150px] max-sm:gap-1 max-sm:justify-start ",
        productMobileClassCart &&
          "max-sm:flex-row  max-sm:w-full max-sm:gap-4 max-sm:px-0 max-sm:py-2",
        className
      )}
    >
      <div>
        <Link
          href={`/product/${item.id}`}
          className={cn(
            " flex items-center justify-center",
            productMobileClassCart && ""
          )}
        >
          <div>
            {(item.discount || item.newModel) && (
              <div
                className={cn(
                  "absolute top-[10px] right-[30px] px-3 py-2 flex items-center justify-center rounded-sm text-[20px] max-sm:px-1 max-sm:py-2 max-sm:text-[14px]",
                  productMobileClassCart && "max-sm:left-16  max-sm:w-[45px]",
                  item.discount
                    ? "bg-[#EBBA1A] text-black"
                    : "bg-green-500 text-white"
                )}
              >
                {item.discount ? `- ${item.discount}%` : "NEW"}
              </div>
            )}
          </div>

          <img
            src={item.img[currentIndex]}
            alt="product"
            className={cn(
              "object-contain h-[150px]",
              productMobileClassCart && "max-sm:w-[100px] max-sm:h-[100px ]"
            )}
          />
        </Link>
        <div className="flex items-center gap-2 justify-center mt-2">
          {item.img.map((_, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(item.id, index)}
            >
              <CircleSmall
                className={cn(
                  "transition-all ",
                  currentIndex === index ? "fill-black" : "fill-gray-400"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col justify-between gap-4",
          productMobileClassCart &&
            "max-sm:justify-start max-sm:w-[300px] gap-0",
          className
        )}
      >
        <div
          className={cn(
            "",
            productMobileClassCart && "max-sm:flex max-sm:gap-1 "
          )}
        >
          <p
            className={cn(
              "text-[18px] flex items-center gap-1 max-sm:text-[14px]",
              productMobileClassCart && "max-sm:text-[16px] "
            )}
          >
            <span>{item.name}</span>
            <span>{item.brand}</span>
          </p>

          <div
            className={cn(
              "flex gap-2 text-[20px]  max-sm:text-[14px] mt-2",
              productMobileClassCart &&
                "max-sm:flex max-sm:items-center max-sm:mt-0 max-sm:text-[16px] "
            )}
          >
            <span>{item.model}</span>
            <span>{item.memory}</span>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-3 mt-2 max-sm:gap-2 max-sm:mt-0",
            productMobileClassCart && "max-sm:ml-40"
          )}
        >
          {item.discount ? (
            <>
              <span className="font-bold text-[20px]  max-sm:text-[12px]">
                {Math.round(item.price * (1 - (item.discount ?? 0) / 100))} грн
              </span>
              <span className="font-light text-[15px]  max-sm:text-[14px] line-through">
                {item.price} грн
              </span>
            </>
          ) : (
            <span className="font-bold  text-[20px]  max-sm:text-[14px] ">
              {item.price} грн
            </span>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-between",
            productMobileClassCart && "max-sm:translate-y-[-38px] "
          )}
        >
          {(availableQuantity ?? 0) > 0 ? (
            <span
              className={cn(
                "text-[#169B00] text-[16px] max-sm:text-[12px]",
                productMobileClassCart && "max-sm:text-[14px]"
              )}
            >
              В наличии
            </span>
          ) : (
            <span
              className={cn(
                "text-red-400 text-[16px]  max-sm:text-[12px] max-sm:whitespace-nowrap",
                productMobileClassCart && "max-sm:text-[14px]"
              )}
            >
              Нет в наличии
            </span>
          )}
          <button
            className={cn(
              "w-[40px] h-[40px] max-sm:w-[20px] max-sm:h-[20px] bg-[#F6F6F6] shadowcustom rounded-xl",
              productMobileClassCart &&
                "max-sm:translate-y-[60px] max-sm:translate-x-[-220px] max-sm:w-[30px] max-sm:h-[30px] max-sm:rounded-sm  "
            )}
          >
            <Heart className="mx-auto max-sm:text-12px" />
          </button>
        </div>
        <Button
          className={cn("")} // стили
          onClick={async () => {
            if (availableQuantity > 0) {
              try {
                setLoadingCart(true); // ← включаем локальный спиннер
                await addToCart(item.id, 1);
                toast.success("Товар добавлен в корзину");
              } catch {
                toast.error("Ошибка при добавлении в корзину");
              } finally {
                setLoadingCart(false); // ← выключаем локальный спиннер
              }
            } else {
              toast.error("Товара нет в наличии");
            }
          }}
          disabled={availableQuantity === 0 || loadingCart}
          productMobileClassCart = {productMobileClassCart}
        >
          {loadingCart ? (
            <Loader2 className="animate-spin w-5 h-5 mx-auto" />
          ) : (
            <span className={cn("max-sm:whitespace-nowrap  max-sm:text-[14px]",productMobileClassCart&&"max-sm:text-[12px] max-sm:whitespace-nowrap ")}>В корзину</span>
          )}
        </Button>
      </div>
    </div>
  );
};
