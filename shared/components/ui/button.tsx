import React from "react";
import { cn } from "../libs";

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled: boolean;
  productMobileClassCart?: boolean
}

export const Button: React.FC<Props> = ({
  className,
  children,
  onClick,
  disabled,
  productMobileClassCart
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-12 py-3 bg-[#091D9E] text-[#F6F6F6] my-auto rounded-xl cursor-pointer max-sm:py-2 max-sm:px-2",
        disabled && "bg-gray-400 cursor-not-allowed",
        productMobileClassCart&&"max-sm:w-[150px] max-sm:translate-x-[150px] max-sm:translate-y-[-35px]",
        className
      )}
    >
      {children}
    </button>
  );
};
