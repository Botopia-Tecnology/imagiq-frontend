import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { productsMock } from "../../components/productsMock";
import { notFound } from "next/navigation";
import ViewProductAppliance from "../../electrodomesticos/ViewProductAppliance";

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default async function ProductViewPage({ params }) {
  const { id } = params;
  const product = productsMock.find((p) => p.id === id);
  if (!product) return notFound();
  const isRefrigerador = product.name?.toLowerCase().includes('refrigerador');

  return isRefrigerador ? (
    <ViewProductAppliance product={product} />
  ) : (
    <ViewProduct product={product} />
  );
}
