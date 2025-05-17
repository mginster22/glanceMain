"use client";

import React from "react";
import { Container, Products, SearchFilters } from "@/shared/components";
import { Filters, useFilters } from "@/shared/hooks/use-filters";
import { ProductItem } from "@/types/products";

interface Props {
  initialProducts: ProductItem[];
  filterFn: (item: ProductItem, filters: Filters) => boolean;
  brands: string[];
  memories: string[];
  models: string[];
  operMemory?: string[];
  className?: string;
}

export const ProductsList: React.FC<Props> = ({
  initialProducts,
  filterFn,
  brands,
  memories,
  models,
  operMemory,
}) => {
  const { filters, handleCheckboxChange, handlePriceChange, filteredData } =
    useFilters(initialProducts, filterFn);
   
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Container className="flex  gap-6 max-sm:flex-col max-sm:gap-0 ">
        <SearchFilters
          filters={filters}
          brands={brands}
          memories={memories}
          models={models}
          operMemory={operMemory}
          onChange={handleCheckboxChange}
          onPriceChange={handlePriceChange}
        />
        <Products products={filteredData} productMobileClassCart={true} />
      </Container>
    </div>
  );
};
