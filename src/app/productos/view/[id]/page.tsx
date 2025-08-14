import ViewProduct from "../../components/ViewProduct";
import { productsMock } from "../../components/productsMock";
import { notFound } from "next/navigation";

export default async function ProductViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = productsMock.find((p) => p.id === id);
  if (!product) return notFound();
  return <ViewProduct product={product} />;
}
