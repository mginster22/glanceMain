"use client";
import React from "react";
import { Container } from "./container";
import { cn } from "./libs";
import { SwiperContainer, Title } from "./ui";
import { SwiperSlide } from "swiper/react";

interface Props {
  className?: string;
}

const bannerItems = [
  {
    title: "Умная колонка",
    text: "при покупке второго товара",
    discont: "СКИДКА 30%",
    img: "/banner1.png",
  },
  {
    title: "Суперцены ",
    text: "на все ноутбуки",
    img: "/bannetnout.png",
  },
  {
    title: "Новинка! ",
    text: "Супер ноутбук",
    img: "/nout1.png",
  },
];

export const Banner: React.FC<Props> = ({ className }) => {
  return (
    <SwiperContainer bannerArrow={true}  >
      {bannerItems.map((item) => (
        <SwiperSlide key={item.title} className="flex justify-center">
          <Container className={cn(" flex justify-center  mt-8", className)}>
            <div
              className={cn(
                "w-full h-[260px] max-sm:h-[180px] bg-black rounded-xl flex relative justify-center gap-[150px] py-8  max-sm:gap-8 max-sm:w-[380px] ",
                className
              )}
            >
              <div className="flex flex-col w-[400px] max-sm:w-[200px] max-sm:px-2">
                <Title
                  text={item.title}
                  className="text-[#F6F6F6] max-sm:text-[18px]"
                  size="2xl"
                />

                <p className="whitespace-nowrap text-[#F6F6F6] max-w-[430px] flex flex-col text-xl mt-8 max-sm:text-[14px] max-sm:mt-1 ">
                  <span className="text-[#EBBA1A] text-3xl max-sm:text-sm">
                    {item.discont}
                  </span>{" "}
                  {item.text}
                </p>
              </div>
              <img
                src={item.img}
                className="translate-y-[32px] max-sm:w-[120px] max-sm:h-[125px] max-sm:translate-y-[21px] max-sm:px-1"
              />
            </div>
          </Container>
        </SwiperSlide>
      ))}
    </SwiperContainer>
  );
};
