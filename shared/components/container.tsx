import React from "react";
import { cn } from "./libs";


interface Props {
    className?: string;
    children?: React.ReactNode
  }
  
 export const Container: React.FC<Props> = ({ className,children }) => {
      return (
          <div className={cn("container max-sm:max-w-[430px] mx-auto", className)}>
              {children}
          </div>
      );
  };