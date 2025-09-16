import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { productsMock } from "../../components/productsMock";
import { findProductById } from "../../data_product/products";
import { notFound } from "next/navigation";
import type { ProductColor } from "../../components/ProductCard";
import type { StaticImageData } from "next/image";

// Tipo base para productos, preparado para futura integración con API
interface BaseProduct {
  id: string;
  name: string;
  image: string | StaticImageData;
  colors: ProductColor[];
  price: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  specs?: { label: string; value: string }[];
}

function normalizeProduct(product: BaseProduct): BaseProduct {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    colors: Array.isArray(product.colors) ? product.colors : [],
    price: product.price ?? "",
    originalPrice: product.originalPrice ?? "",
    discount: product.discount ?? "",
    rating: product.rating,
    reviewCount: product.reviewCount,
    description: product.description ?? "",
    specs: product.specs ?? [],
  };
}

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("🔍 [DEBUG] Product ID requested:", id);

  // Usar la función optimizada para buscar el producto
  let product = findProductById(id);

  // Si no se encuentra en los datos centralizados, buscar en productsMock (compatibilidad)
  if (!product && Array.isArray(productsMock)) {
    const mockProduct = productsMock.find((p) => p.id === id);
    if (mockProduct) {
      // Mapear el producto de productsMock al formato BaseProduct
      product = {
        id: mockProduct.id,
        sku: mockProduct.id, // Usar id como sku por compatibilidad
        name: mockProduct.name,
        image: mockProduct.image,
        colors: mockProduct.colors,
        rating: 4.5, // Valor por defecto
        reviewCount: 100, // Valor por defecto
        price: mockProduct.price,
        originalPrice: mockProduct.originalPrice,
        discount: mockProduct.discount,
        isNew: false,
      };
    }
    console.log("🔍 [DEBUG] Found in productsMock:", !!product);
  }

  console.log("🔍 [DEBUG] Final product found:", !!product);

  if (!product) {
    console.error("❌ [ERROR] Product not found for ID:", id);
    return notFound();
  }

  const normalizedProduct = normalizeProduct(product);
  console.log("✅ [SUCCESS] Normalized product:", normalizedProduct);

  // Renderiza la vista de detalle con los datos dinámicos
  return <ViewProduct product={normalizedProduct} />;
}
