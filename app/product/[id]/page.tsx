// app/product/[id]/page.tsx
import { ProductInfoBlock } from "@/shared/components/product-info-block";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const parsedId = parseInt(id);

  return <ProductInfoBlock productId={parsedId} />;
}
