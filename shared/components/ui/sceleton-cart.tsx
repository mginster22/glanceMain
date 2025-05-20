"use client";
import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "../libs";
interface Props {
  className?: string;
}

export const SkeletonCart: React.FC<Props> = ({ className }) => {
  const skeletons = Array.from({ length: 2 });

  return (
    <div className={cn("flex flex-col gap-4 px-2", className)}>
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className="flex w-full border-t border-gray-200 py-4 items-center gap-4"
        >
          {/* Картинка */}
          <Skeleton className="w-[75px] h-[75px] rounded-md" />

          {/* Контент карточки */}
          <div className="flex flex-col items-start gap-2 w-full">
            {/* Название */}
            <Skeleton className="h-4 w-1/2" />

            {/* Цена */}
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>

            {/* Кнопки */}
            <div className="flex justify-between gap-6 items-center mt-2 w-full">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-[110px] rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
