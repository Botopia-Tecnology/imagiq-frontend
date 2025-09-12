import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default async function ProductViewPage({ params }) {
  const { id } = params;
  
  // Usar el hook de productos para obtener el producto específico
  const { product, loading, error } = useProduct(id);
  
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return notFound();
  }
  
  return <ViewProduct product={product} />;
}
