"use client";

import { cn } from "../libs";
import { Skeleton } from "./skeleton";

interface Props {
  className?: string;
  productMobileClassCart?: boolean;
}

export const ProductSkeleton: React.FC<Props> = ({
  className,
  productMobileClassCart,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 justify-between mr-2 shadowcustom px-2 py-2 rounded-xl w-[217px] max-sm:w-[150px] max-sm:gap-1 max-sm:justify-start",
        productMobileClassCart &&
          "max-sm:flex-row max-sm:w-full max-sm:gap-4 max-sm:px-0 max-sm:py-2",
        className
      )}
    >
      <div>
        <div className="relative flex items-center justify-center">
          <Skeleton
            className={cn(
              "h-[150px] w-full rounded-md",
              productMobileClassCart && "max-sm:w-[100px] max-sm:h-[100px]"
            )}
          />
        </div>
        <div className="flex items-center gap-2 justify-center mt-2">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
              <Skeleton key={idx} className="w-4 h-4 rounded-full" />
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
        <div className={cn("", productMobileClassCart && "max-sm:flex max-sm:gap-1")}>
          <Skeleton className="h-5 w-3/4 max-sm:w-1/2" />
          <Skeleton className="h-5 w-1/2 max-sm:w-1/3 mt-2" />
        </div>

        <div
          className={cn(
            "flex items-center gap-3 mt-2 max-sm:gap-2 max-sm:mt-0",
            productMobileClassCart && "max-sm:ml-40"
          )}
        >
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>

        <div
          className={cn(
            "flex items-center justify-between",
            productMobileClassCart && "max-sm:translate-y-[-38px]"
          )}
        >
          <Skeleton className="h-5 w-20" />
          <Skeleton
            className={cn(
              "w-[40px] h-[40px] rounded-xl",
              productMobileClassCart &&
                "max-sm:translate-y-[60px] max-sm:translate-x-[-220px] max-sm:w-[30px] max-sm:h-[30px] max-sm:rounded-sm"
            )}
          />
        </div>

        <Skeleton className="h-12   w-full mt-2 rounded-lg" />
      </div>
    </div>
  );
};
