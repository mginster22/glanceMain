import React from "react";
import { cn } from "../libs";

interface Props {
  className?: string;
  text?: string;
  onClick?: () => void;
  disabled: boolean;
}

export const Button: React.FC<Props> = ({
  className,
  text,
  onClick,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-12 py-3 bg-[#091D9E] text-[#F6F6F6]  my-auto",
        disabled && "bg-gray-400 cursor-not-allowed",
        className
      )}
    >
      {text}
    </button>
  );
};
