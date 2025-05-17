import prisma from "@/lib/prisma";
import {ProductInfoBlock} from "@/shared/components/product-info-block";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const parsedId = parseInt(id);
  
  return <ProductInfoBlock productId={parsedId} />;
}
