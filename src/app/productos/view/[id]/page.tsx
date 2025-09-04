import ViewProduct from "../../components/ViewProductMobile";
import { productsMock } from "../../components/productsMock";
import { notFound } from "next/navigation";

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default async function ProductViewPage({ params }) {
  const { id } = params;
  const product = productsMock.find((p) => p.id === id);
  if (!product) return notFound();
  return <ViewProduct product={product} />;
}
