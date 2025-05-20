"use client";

import React from "react";
import { Skeleton } from "./skeleton"; // Предполагаю, что у тебя есть компонент Skeleton
import { Container } from "@/shared/components";
import { cn } from "@/shared/components/libs";

interface Props {
  className?: string;
}

export const ProductInfoBlockSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <Container
      className={cn("mt-4 flex flex-col max-sm:pb-40 max-sm:px-4", className)}
    >
      {/* Заголовок */}
      <div className="mb-4">
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>

      <div className="flex justify-between max-sm:flex-col gap-6">
        {/* Изображение */}
        <Skeleton className="w-[400px] h-[500px] max-sm:w-[200px] max-sm:h-[200px] rounded-md" />

        {/* Описание */}
        <div className="w-[350px] max-sm:w-full flex flex-col gap-4">
          <Skeleton className="h-8 w-full max-sm:w-3/4 rounded-md" />
          <Skeleton className="h-5 w-32 rounded-md" />

          <div className="flex flex-col gap-3 mt-4">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/6 rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </div>

        {/* Блок покупки */}
        <div className="flex flex-col items-center bg-[#E7E7ED] max-w-[300px] w-full max-h-[200px] py-8 rounded-md gap-4">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-md" />
        </div>
      </div>
    </Container>
  );
};
