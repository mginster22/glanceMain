import React from "react";
import {  ProductsList } from "@/shared/components";
import { phoneFilterFn } from "@/shared/components/libs/get-phone-filters";
import prisma from "@/lib/prisma";

const brands = ["Apple", "HUAWEI", "Xiaomi"];
const memories = ["64GB", "128GB"];
const models = ["iPhone 14", "iPhone 12", "nova Y61", "Redmi"];

export default async function PhonePage() {
  const phoneRaw = await prisma.product.findMany({
    where: {
      name: "Смартфон",
    },
  })
   const phone = phoneRaw.map((item) => ({
    ...item,
    initialQuantity: item.quantity??0,
  }))

  return (
    <ProductsList
      initialProducts={phone}
      filterFn={phoneFilterFn}
      brands={brands}
      memories={memories}
      models={models}
    />
  );
}
