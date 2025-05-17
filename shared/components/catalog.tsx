"use client";
import React from "react";
import { Container } from "./container";
import { catalog } from "./constants/catalog";
import { cn } from "./libs";
import { Title } from "./ui";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface Props {
  className?: string;
}

export const Catalog: React.FC<Props> = ({ className }) => {
  const swiperRef = React.useRef<any>(null);

  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);
  return (
    <div className={cn("mt-30 max-sm:mt-8 max-sm:px-2", className)}>
      <Container className="flex flex-col gap-8">
        <Title text="Каталог" size="md" className="max-sm:text-[20px]"/>

        <div className="relative flex justify-between">
          {!isBeginning && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
              <ChevronLeft />
            </button>
          )}

          {/* Правая стрелка */}
          {!isEnd && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute z-10 right-0 top-[35%] bg-white p-2 rounded-full shadow-md"
            >
              <ChevronRight />
            </button>
          )}
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            
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
            {catalog.map((item) => (
              <SwiperSlide
                key={item.id}
                className="flex items-center  !w-[200px] px-2 max-sm:!w-[150px]"
              >
                <Link href={item.link} className="flex flex-col items-center gap-4">
                  <div className="w-[200px] h-[211px] bg-[#BCC5FF] flex items-center justify-center rounded-2xl max-sm:w-[150px] max-sm:h-[150px]">
                    <img src={item.img} className="max-sm:w-[110px] max-sm:h-[110px] max-sm:object-contain"/>
                  </div>
                  <span className="text-[20px] font-light">{item.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </div>
  );
};
