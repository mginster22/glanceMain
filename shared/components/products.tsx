"use client";
import React from "react";
import { cn } from "./libs";
import { SwiperContainer } from "./ui";
import { SwiperSlide } from "swiper/react";
import { Product } from "./product";
import { ProductItem } from "@/types/products";

interface Props {
  className?: string;
  children?: React.ReactNode;
  useSwiper?: boolean;
  products: ProductItem[];
  productMobileClassCart?: boolean;
}

export const Products: React.FC<Props> = ({
  className,
  useSwiper,
  products,
  productMobileClassCart,
}) => {
  
  return (
    <div className={cn("mt-4", className)}>
      {useSwiper ? (
        <SwiperContainer className={className}>
          {products.map((item) => (
            <SwiperSlide
              key={item.id}
              className="py-1 !w-[250px] px-2 max-sm:!w-[170px]"
            >
              <Product key={item.id} item={item} />
            </SwiperSlide>
          ))}
        </SwiperContainer>
      ) : (
        <div
          className={cn(
            "flex flex-wrap  gap-4 ",
            productMobileClassCart && "max-sm:flex-col  max-sm:p-0",
            className
          )}
        >
          {products.map((item) => (
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
