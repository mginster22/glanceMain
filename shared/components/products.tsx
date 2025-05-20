"use client";
import React from "react";
import { cn } from "./libs";
import { SwiperContainer } from "./ui";
import { SwiperSlide } from "swiper/react";
import { Product } from "./product";
import { ProductItem } from "@/types/products";
import { ProductSkeleton } from "./ui/sceleton-product";

interface Props {
  className?: string;
  children?: React.ReactNode;
  useSwiper?: boolean;
  products: ProductItem[];
  productMobileClassCart?: boolean;
  isLoading?: boolean;
}

export const Products: React.FC<Props & { isLoading?: boolean }> = ({
  className,
  useSwiper,
  products,
  productMobileClassCart,
  isLoading = false,
}) => {
  // если идёт загрузка, покажем скелетоны (пусть будет 4 штук для примера)
  const skeletonCount = 4;

  return (
    <div className={cn("mt-4", className)}>
      {useSwiper ? (
        <SwiperContainer className={className}>
          {isLoading
            ? Array(skeletonCount).fill(null).map((_, idx) => (
                <SwiperSlide key={"skeleton-" + idx} className="py-1 !w-[250px] px-2 max-sm:!w-[170px]">
                  <ProductSkeleton productMobileClassCart={productMobileClassCart} />
                </SwiperSlide>
              ))
            : products.map((item) => (
                <SwiperSlide
                  key={item.id}
                  className="py-1 !w-[250px] px-2 max-sm:!w-[170px]"
                >
                  <Product item={item} />
                </SwiperSlide>
              ))}
        </SwiperContainer>
      ) : (
        <div
          className={cn(
            "flex flex-wrap gap-4",
            productMobileClassCart && "max-sm:flex-col max-sm:p-0",
            className
          )}
        >
          {isLoading
            ? Array(skeletonCount).fill(null).map((_, idx) => (
                <ProductSkeleton
                  key={"skeleton-" + idx}
                  productMobileClassCart={productMobileClassCart}
                />
              ))
            : products.map((item) => (
                <Product
                  key={item.id}
                  item={item}
                  productMobileClassCart={productMobileClassCart}
                />
              ))}
        </div>
      )}
    </div>
  );
};
