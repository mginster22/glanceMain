import { Catalog, Banner, Stock } from "@/shared/components";
import React from "react";

export default async function Home() {
  return (
    <div className="mt-4 max-sm:pb-20">

  
      <Banner />
      <Catalog />
      <Stock />
    </div>
  );
}
