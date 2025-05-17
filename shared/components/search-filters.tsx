import React from "react";
import { cn } from "./libs";

interface Filters {
  brand: string[];
  model: string[];
  memory: string[];
  minPrice: string;
  maxPrice: string;
}

interface Props {
  className?: string;
  filters: Filters;
  brands: string[];
  memories: string[];
  models: string[];
  operMemory?: string[];
  onChange: (key: "brand" | "model" | "memory", value: string) => void;
  onPriceChange: (key: "minPrice" | "maxPrice", value: string) => void;
}

export const SearchFilters: React.FC<Props> = ({
  className,
  filters,
  brands,
  memories,
  models,
  operMemory,
  onChange,
  onPriceChange,
}) => {
  const handleCheckboxChange = (
    key: "brand" | "model" | "memory",
    value: string
  ) => {
    onChange(key, value);
  };

  const renderFilterBlock = (
    title: string,
    items: string[],
    filterKey: "brand" | "model" | "memory"
  ) => (
    <div className="flex flex-col gap-2 mt-2 max-h-[300px] w-[400px]">
      <h4 className="font-bold text-[18px] mb-2">{title}</h4>
      <div className="overflow-y-auto pr-2 max-h-[60px]">
        {items.map((item) => (
          <label key={item} className="block">
            <input
              type="checkbox"
              checked={filters[filterKey].includes(item)}
              onChange={() => handleCheckboxChange(filterKey, item)}
              className="mr-2"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "w-[289px] flex flex-col justify-between max-h-[600px] shadowcustom mt-4 p-4 sticky top-30 max-sm:hidden",
        className
      )}
    >
      {renderFilterBlock("Бренд", brands, "brand")}
      {renderFilterBlock("Память", memories, "memory")}
      {renderFilterBlock("Модель", models, "model")}

      {operMemory && (
        <div className="flex flex-col gap-2 mt-2 max-h-[300px]">
          <h4 className="font-bold text-[18px] mb-2">Оперативная память</h4>
          <div className="overflow-y-auto pr-2 max-h-[40px]">
            {operMemory.map((memory) => (
              <label key={memory} className="block">
                <input
                  type="checkbox"
                  checked={filters.memory.includes(memory)}
                  onChange={() => handleCheckboxChange("memory", memory)}
                  className="mr-2"
                />
                {memory}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-bold text-[18px] mb-2">Цена</h4>
        <input
          type="number"
          placeholder="Мин."
          value={filters.minPrice}
          onChange={(e) => onPriceChange("minPrice", e.target.value)}
          className="w-full border p-1 mb-2"
        />
        <input
          type="number"
          placeholder="Макс."
          value={filters.maxPrice}
          onChange={(e) => onPriceChange("maxPrice", e.target.value)}
          className="w-full border p-1"
        />
      </div>
    </div>
  );
};
