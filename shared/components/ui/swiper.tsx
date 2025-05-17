"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../libs";
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";

interface Props {
  className?: string;
  children?: React.ReactNode;
  bannerArrow?: boolean;
}

export const SwiperContainer: React.FC<Props> = ({
  className,
  children,
  bannerArrow,
}) => {
  const swiperRef = React.useRef<any>(null);

  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      {/* Левая стрелка */}
      {!isBeginning && (
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className={cn(
            "absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md",
            bannerArrow && "left-22 top-[55%] max-sm:hidden"
          )}
        >
          <ChevronLeft />
        </button>
      )}

      {/* Правая стрелка */}
      {!isEnd && (
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className={cn(
            "absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md",
            bannerArrow && "right-22 top-[55%] max-sm:hidden"
          )}
        >
          <ChevronRight />
        </button>
      )}

      {bannerArrow ? (
        <Swiper
          className={className}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2000, // 2 секунды
            disableOnInteraction: false, // не останавливать при взаимодействии
          }}
          loop={true} // бесконечная прокрутка
          slidesPerView="auto"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
        >
          {children}
        </Swiper>
      ) : (
        <Swiper
          className={className}
          modules={[Navigation]}
          slidesPerView="auto"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
           
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
        >
          {children}
        </Swiper>
      )}
    </div>
  );
};
