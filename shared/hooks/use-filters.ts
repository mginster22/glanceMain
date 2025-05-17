"use client";
import { useMemo, useState } from "react";

export interface Filters {
  brand: string[];
  model: string[];
  memory: string[];
  minPrice: string;
  maxPrice: string;
}

const initialFilters: Filters = {
  brand: [],
  model: [],
  memory: [],
  minPrice: "",
  maxPrice: "",
};

export const useFilters = <T>(
  data: T[],
  filterFn: (item: T, filters: Filters) => boolean
) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleCheckboxChange = (key: "brand" | "model" | "memory", value: string) => {
    setFilters((prev) => {
      const current = prev[key];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handlePriceChange = (key: "minPrice" | "maxPrice", value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => filterFn(item, filters));
  }, [data, filters, filterFn]);

  return {
    filters,
    setFilters,
    handleCheckboxChange,
    handlePriceChange,
    filteredData,
  };
};
