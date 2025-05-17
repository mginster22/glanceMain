"use client";
import { useProductStore } from "@/store/useProduct";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = () => {

  const {searchTerm,products} = useProductStore((state) => state);

  const setSearchTerm = useProductStore(state => state.setSearchTerm)
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term)
    );
  });

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSearchTerm(""); // Сброс поиска
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchTerm]);

  return (
    <div className="flex flex-col " ref={wrapperRef}>
      <label className="flex items-center relative w-[750px] max-sm:w-[350px]">
        <Search className="absolute left-4" size={20} />
        <input
          type="search"
          value={searchTerm}
          placeholder="Поиск..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-[40px] bg-[#DEDEDE] rounded-[10px] pl-14 pr-4 "
        />
      </label>
      {searchTerm && (
        <div className="absolute top-20 max-w-[600px] w-full left-80  bg-white border border-gray-300 mt-2 rounded shadow-md max-h-[200px] overflow-auto z-10 max:sm:w-[350px] max-sm:z-50 max-sm:top-30 max-sm:left-0">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="p-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <img
                  src={product.img[0]}
                  className="w-[40px] h-[40px] object-contain"
                />
                <span> {product.name} </span>
                <span className="text-gray-500">{product.brand}</span>
                <span>{product.model}</span>
                <span>{product.memory}</span>
              </Link>
            ))
          ) : (
            <div className="p-2 text-gray-500">Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  );
};
