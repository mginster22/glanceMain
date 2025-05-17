import prisma from "@/lib/prisma";
import { ProductsList } from "@/shared/components";
import { noutFilterFn } from "@/shared/components/libs/get-nout-filters";
import React from "react";

interface Props {
  className?: string;
}
const brands = ["Apple", "HUAWEI", "Xiaomi"];
const memories = ["64GB", "128GB"];
const models = ["iPhone 14", "iPhone 12", "nova Y61", "Redmi"];
const operMemory = ["1Gb", "2Gb", "4Gb", "8Gb"];

export default async function NoutPage() {
  const noutRaw = await prisma.product.findMany({
    where: {
      name: "Ноутбук",
    },
  });
  const nout = noutRaw.map((item) => ({
    ...item,
    initialQuantity: item.quantity??0,
  }))

  return (
    <ProductsList
      initialProducts={nout}
      filterFn={noutFilterFn}
      brands={brands}
      memories={memories}
      models={models}
      operMemory={operMemory}
    />
  );
}
