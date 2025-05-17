"use client";
import { Container, Products } from "@/shared/components";
import { cn } from "@/shared/components/libs";
import { useProductStore } from "@/store/useProduct";
import React from "react";


interface Props {
    className?: string;
  }
  
 export const CatalogProducts: React.FC<Props> = ({ className }) => {
     const { products } = useProductStore((state) => state);
    
      const phones = products.filter((p) => p.name === "Смартфон");
      const nouts = products.filter((p) => p.name === "Ноутбук");
    
      const linkArr = [
        {
          link: "#smartphones",
          title: "Смартфоны",
        },
        {
          link: "#nouts",
          title: "Ноутбуки",
        },
        {
          link: "#smartphones",
          title: "Компютеры",
        },
        {
          link: "#smartphones",
          title: "Планшеты",
        },
        {
          link: "#smartphones",
          title: "Часы",
        },
      ];
      return (
           <Container className={cn("mt-4 flex flex-col gap-2 max-sm:pb-20")}>
               <div
                 className={cn(
                   "flex flex-col gap-8 fixed top-55 left-4  z-30 max-sm:top-0 max-sm:flex-row max-sm:bg-white max-sm:left-0 max-sm:px-2 max-sm:shadow-md max-sm:sticky max-sm:w-full "
                 )}
               >
                 {linkArr.map((l, index) => (
                   <a href={l.link} key={index} className="text-sm border-b-1  py-3 max-sm:border-b-0 max-sm:text-[12px]">
                     {l.title}
                   </a>
                 ))}
               </div>
               
               <h2
                 id="smartphones"
                 className="scroll-mt-40 text-xl font-bold mb-4 ml-20 max-sm:ml-4"
               >
                 Смартфоны
               </h2>
               <Products products={phones} className="max-w-500  pl-8  max-sm:pl-0" productMobileClassCart={true} />
         
               <h2
                 id="nouts"
                 className="scroll-mt-40 text-xl font-bold mt-8 mb-4 ml-20 max-sm:ml-4"
               >
                 Ноутбуки
               </h2>
               <Products products={nouts} className="max-w-500 pl-8 max-sm:pl-0" productMobileClassCart={true}/>
             </Container>
      );
  };