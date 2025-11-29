import UnifiedBundleCarousel from "./UnifiedBundleCarousel";
import type { BundleProduct } from "@/lib/api";

interface BundleImagesProps {
  bundleName: string;
  imagePreviewUrl: string[];
  mainProduct?: BundleProduct;
  allProducts?: BundleProduct[];
}

/**
 * Componente que muestra las imágenes del bundle
 * Utiliza un carrusel unificado que combina:
 * - Primera imagen: Composición del bundle completo
 * - Siguientes imágenes: Imágenes individuales de cada producto
 */
export function BundleImages({
  bundleName,
  imagePreviewUrl,
  mainProduct,
  allProducts,
}: BundleImagesProps) {
  return (
    <div className="space-y-6">
      {/* Carrusel unificado con imagen compuesta + productos individuales */}
      <UnifiedBundleCarousel
        bundleName={bundleName}
        bundleCompositeImages={imagePreviewUrl}
        mainProduct={mainProduct}
        allProducts={allProducts}
        onOpenModal={(imageIndex) => {
          // TODO: Implementar modal de imagen ampliada
          console.log("Abrir modal con imagen:", imageIndex);
        }}
      />
    </div>
  );
}
