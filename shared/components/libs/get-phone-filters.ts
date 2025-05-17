"use client"
import { Filters } from "@/shared/hooks/use-filters";
import { products } from "../constants/products";
const phone = products.filter((item) => item.name === "nout");


export const phoneFilterFn = (item: (typeof phone)[0], filters: Filters) => {
  const inBrand =
    filters.brand.length === 0 || filters.brand.includes(item.brand);
  const inModel =
    filters.model.length === 0 || filters.model.includes(item.model.trim());
  const inMemory =
    filters.memory.length === 0 || filters.memory.includes(item.memory);

  const price = item.price;
  const min = filters.minPrice ? parseInt(filters.minPrice) : 0;
  const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
  const inPrice = price >= min && price <= max;

  return inBrand && inModel && inMemory && inPrice;
};