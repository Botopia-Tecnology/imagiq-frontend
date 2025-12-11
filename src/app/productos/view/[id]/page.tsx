"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import smartphonesImg from "@/img/dispositivosmoviles/cel1.png";
import {
  ProductCardProps,
  ProductColor,
} from "@/app/productos/components/ProductCard";
import type {
  ProductVariant,
  ColorOption,
  UseProductSelectionReturn,
} from "@/hooks/useProductSelection";
import DetailsProductSection from "@/app/productos/dispositivos-moviles/detalles-producto/DetailsProductSection";
import ProductDetailSkeleton from "@/app/productos/dispositivos-moviles/detalles-producto/ProductDetailSkeleton";
import AddToCartButton from "../../viewpremium/components/AddToCartButton";
import StockNotificationModal from "@/components/StockNotificationModal";
import { useStockNotification } from "@/hooks/useStockNotification";
import { useAnalytics } from "@/lib/analytics/hooks/useAnalytics";
import { useTradeInPrefetch } from "@/hooks/useTradeInPrefetch";

// Type for the product selection data passed from DetailsProductSection
// This is a subset of UseProductSelectionReturn with only the properties passed by the callback
type ProductSelectionData = {
  selectedSku: string | null;
  selectedPrice: number | null;
  selectedOriginalPrice: number | null;
  selectedStockTotal: number | null;
  selectedVariant: ProductVariant | null;
  selectedSkuPostback: string | null;
  selection: {
    selectedColor: string | null;
    selectedCapacity: string | null;
    selectedMemoriaram: string | null;
  };
  getSelectedColorOption: () => ColorOption | null;
};

// Convierte ProductCardProps a formato esperado por ViewProduct
function convertProductForView(product: ProductCardProps) {
  const image =
    typeof product.image === "string" ? smartphonesImg : product.image;
  const safeValue = (
    value: string | number | null | undefined,
    fallback: string = "None"
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return fallback;
    }
    return String(value);
  };
  return {
    id: safeValue(product.id, "None"),
    name: safeValue(product.name, "None"),
    image: image,
    price: safeValue(product.price, "None"),
    originalPrice: product.originalPrice
      ? safeValue(product.originalPrice)
      : undefined,
    discount: product.discount ? safeValue(product.discount) : undefined,
    colors:
      product.colors?.map((color: ProductColor) => ({
        name: safeValue(color.name || color.label, "None"),
        hex: safeValue(color.hex, "#808080"),
      })) || [],
    category: product.apiProduct?.categoria || "", // Use category from API
    description: safeValue(product.apiProduct?.descGeneral?.[0], "None"),
    specs: [
      { label: "Marca", value: "Samsung" }, // ProductApiData no tiene campo marca, todos son Samsung
      { label: "Modelo", value: safeValue(product.apiProduct?.modelo?.[0], "None") },
      {
        label: "Categoría",
        value: safeValue(product.apiProduct?.categoria, "None"),
      },
      {
        label: "Subcategoría",
        value: safeValue(product.apiProduct?.subcategoria, "None"),
      },
      {
        label: "Capacidad",
        value: safeValue(
          product.selectedCapacity?.value || product.capacities?.[0]?.value,
          "None"
        ),
      },
      {
        label: "SKU",
        value: safeValue(
          product.selectedColor?.sku || product.colors?.[0]?.sku,
          "None"
        ),
      },
    ],
  };
}

// Helper: Verificar si el producto tiene contenido premium (imágenes/videos)
function hasPremiumContent(prod: ProductCardProps): boolean {
  // Verificar en apiProduct (imagenPremium/videoPremium)
  const checkArrayOfArrays = (arr?: string[][]): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some((innerArray: string[]) => {
      if (!Array.isArray(innerArray) || innerArray.length === 0) return false;
      return innerArray.some(item => item && typeof item === 'string' && item.trim() !== '');
    });
  };

  const hasApiPremiumContent = 
    checkArrayOfArrays(prod.apiProduct?.imagenPremium) ||
    checkArrayOfArrays(prod.apiProduct?.videoPremium) ||
    checkArrayOfArrays(prod.apiProduct?.imagen_premium) ||
    checkArrayOfArrays(prod.apiProduct?.video_premium);

  // Verificar en los colores del producto
  const hasColorPremiumContent = prod.colors?.some(color => {
    const hasColorImages = color.imagen_premium && Array.isArray(color.imagen_premium) && 
      color.imagen_premium.length > 0 && 
      color.imagen_premium.some((img: string) => img && typeof img === 'string' && img.trim() !== '');
    const hasColorVideos = color.video_premium && Array.isArray(color.video_premium) && 
      color.video_premium.length > 0 && 
      color.video_premium.some((vid: string) => vid && typeof vid === 'string' && vid.trim() !== '');
    return hasColorImages || hasColorVideos;
  }) || false;

  return hasApiPremiumContent || hasColorPremiumContent;
}

// Helper: Verificar si el segmento es premium
function isPremiumSegment(prod: ProductCardProps): boolean {
  const segmento = prod.segmento || 
    (prod.apiProduct?.segmento && Array.isArray(prod.apiProduct.segmento) ? prod.apiProduct.segmento[0] : undefined);
  if (!segmento) return false;
  const segmentoValue = Array.isArray(segmento) ? segmento[0] : segmento;
  return segmentoValue?.toUpperCase() === 'PREMIUM';
}

// Wrapper para manejar el estado de carga de variantes
function ProductContentWithVariants({
  product,
  onVariantsReady,
  onProductSelectionChange,
  productSelection,
  onNotifyStock,
}: {
  product: ProductCardProps;
  onVariantsReady: (ready: boolean) => void;
  onProductSelectionChange?: (selection: ProductSelectionData) => void;
  productSelection: ProductSelectionData | null;
  onNotifyStock?: () => void;
}) {
  const convertedProduct = convertProductForView(product);

  return (
    <>
      <DetailsProductSection
        product={product}
        onVariantsReady={onVariantsReady}
        onProductSelectionChange={onProductSelectionChange}
      />
      <ViewProduct product={convertedProduct} flix={product} productSelection={productSelection} />
      <AddToCartButton
        product={product}
        productSelection={productSelection}
        onNotifyStock={onNotifyStock}
      />
    </>
  );
}

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default function ProductViewPage({ params }) {
  const resolvedParams = use(params);
  type ParamsWithId = { id: string };
  const id =
    resolvedParams &&
      typeof resolvedParams === "object" &&
      "id" in resolvedParams
      ? (resolvedParams as ParamsWithId).id
      : undefined;
  // Estado para almacenar el producto inicial desde localStorage (Optimistic UI)
  const [initialProduct, setInitialProduct] = React.useState<ProductCardProps | null>(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const saved = localStorage.getItem(`product_selection_${id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convertir datos guardados a estructura ProductCardProps mínima necesaria
          return {
            id: id,
            name: parsed.productName || "",
            image: parsed.image || smartphonesImg.src,
            price: parsed.price?.toString(),
            originalPrice: parsed.originalPrice?.toString(),
            colors: parsed.color ? [{
              name: parsed.color,
              hex: parsed.colorHex || "#000000",
              label: parsed.color,
              sku: parsed.sku || "",
              ean: parsed.ean || ""
            }] : [],
            capacities: parsed.capacity ? [{
              value: parsed.capacity,
              label: parsed.capacity
            }] : [],
            segmento: parsed.segmento,
            skuflixmedia: parsed.skuflixmedia, // Mapear skuflixmedia desde localStorage
            // Datos mínimos para que funcione la UI
            apiProduct: {
              codigoMarketBase: id,
              codigoMarket: [],
              nombreMarket: [parsed.productName || ""],
              categoria: "Móviles", // Fallback seguro
              subcategoria: "",
              modelo: [parsed.productName || ""],
              color: [],
              capacidad: [],
              memoriaram: [],
              descGeneral: [],
              sku: [],
              ean: [],
              desDetallada: [],
              stockTotal: [],
              cantidadTiendas: [],
              cantidadTiendasReserva: [],
              urlImagenes: [],
              urlRender3D: [],
              imagePreviewUrl: [],
              imageDetailsUrls: [],
              precioNormal: [],
              precioeccommerce: [],
              fechaInicioVigencia: [],
              fechaFinalVigencia: [],
              indRetoma: [],
              indcerointeres: [],
              skuPostback: [],
              skuflixmedia: parsed.skuflixmedia ? [parsed.skuflixmedia] : [], // También en apiProduct por si acaso
            }
          } as ProductCardProps;
        }
      } catch (e) {
        console.error("Error parsing saved product selection:", e);
      }
    }
    return null;
  });

  const { product: apiProduct, loading, error } = useProduct(id ?? "");
  const router = useRouter();

  // Usar producto del API si está listo, sino usar el inicial de localStorage
  const product = apiProduct || initialProduct;

  const [variantsReady, setVariantsReady] = React.useState(false);
  const [productSelection, setProductSelection] =
    React.useState<ProductSelectionData | null>(null);
  const [shouldRedirectToPremium, setShouldRedirectToPremium] = React.useState(false);
  const [premiumCheckDone, setPremiumCheckDone] = React.useState(false);
  const stockNotification = useStockNotification();
  const { trackViewItem } = useAnalytics();

  // 🚀 Prefetch automático de datos de Trade-In
  useTradeInPrefetch();

  // 🔄 Verificar si el producto tiene contenido premium y debe redirigir a viewpremium
  // IMPORTANTE: Solo redirigir si tiene AMBOS: segmento premium Y contenido premium
  // Esto evita loops infinitos con viewpremium
  React.useEffect(() => {
    if (apiProduct && !loading && id) {
      const hasPremium = hasPremiumContent(apiProduct);
      const isPremium = isPremiumSegment(apiProduct);
      
      console.log('[VIEW] 🔍 Verificando contenido premium:', {
        id,
        hasPremium,
        isPremium,
        apiProductSegmento: apiProduct.apiProduct?.segmento,
        hasImagenPremium: !!apiProduct.apiProduct?.imagenPremium?.length,
        hasVideoPremium: !!apiProduct.apiProduct?.videoPremium?.length,
      });
      
      // Solo redirigir si tiene segmento PREMIUM Y contenido premium
      // Esto es consistente con viewpremium que requiere ambos
      if (hasPremium && isPremium) {
        console.log('[VIEW] ➡️ Redirigiendo a viewpremium (tiene segmento Y contenido premium)');
        setShouldRedirectToPremium(true);
        router.replace(`/productos/viewpremium/${id}`);
      } else {
        // No es premium, marcar verificación como completa
        setPremiumCheckDone(true);
      }
    }
  }, [apiProduct, loading, id, router]);

  // Reset variants ready cuando cambia el producto
  React.useEffect(() => {
    setVariantsReady(false);
  }, [id]);

  // 🔥 Track View Item apenas el producto carga (solo una vez por producto)
  React.useEffect(() => {
    if (product && !loading) {
      const productPrice =
        typeof product.price === "number"
          ? product.price
          : Number.parseFloat(String(product.price)) || 0;

      trackViewItem({
        item_id: product.id,
        item_name: product.name,
        item_brand: "Samsung",
        item_category: product.apiProduct?.categoria || "Sin categoría",
        price: productPrice,
        currency: "COP",
      });
    }
    // Solo ejecutar cuando el producto carga, NO cuando cambia la selección de variante
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, loading]);

  // Callback para recibir productSelection desde DetailsProductSection
  const handleProductSelectionChange = React.useCallback(
    (selection: ProductSelectionData) => {
      setProductSelection(selection);
    },
    []
  );

  // Handler para notificación de stock
  const handleRequestStockNotification = async (email: string) => {
    if (!product || !productSelection) return;

    // Obtener el SKU del producto seleccionado
    const selectedSku = productSelection.selectedSku;

    // Obtener el codigoMarket correspondiente a la variante seleccionada
    const codigoMarket =
      productSelection.selectedVariant?.codigoMarket ||
      product.apiProduct?.codigoMarketBase ||
      "";

    await stockNotification.requestNotification({
      productName: product.name,
      email,
      sku: selectedSku || undefined,
      codigoMarket,
    });
  };

  if (!id) {
    return notFound();
  }

  // SIEMPRE mostrar skeleton mientras:
  // 1. Está cargando el producto desde el API
  // 2. Ya determinamos que debe redirigir a viewpremium (evita flash)
  // 3. El producto cargó pero aún no se verificó si es premium
  if (loading || shouldRedirectToPremium || (apiProduct && !premiumCheckDone)) {
    return <ProductDetailSkeleton />;
  }

  // Si hubo error y no hay producto del API, mostrar not found
  if (error && !apiProduct) {
    return notFound();
  }

  // Si no hay producto del API después de cargar, mostrar not found
  if (!apiProduct) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Producto no encontrado
            </h2>
            <p className="text-gray-600">
              El producto que buscas no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // En este punto, apiProduct está garantizado que existe
  const productToUse = apiProduct;

  return (
    <>
      {/* Modal de notificación de stock */}
      <StockNotificationModal
        isOpen={stockNotification.isModalOpen}
        onClose={stockNotification.closeModal}
        productName={productToUse.name}
        productImage={
          productSelection?.selectedVariant?.imagePreviewUrl ||
          (typeof productToUse.image === "string"
            ? productToUse.image
            : smartphonesImg.src)
        }
        selectedColor={
          productSelection?.getSelectedColorOption?.()?.nombreColorDisplay ||
          productSelection?.selection?.selectedColor ||
          undefined
        }
        selectedStorage={
          productSelection?.selection?.selectedCapacity || undefined
        }
        onNotificationRequest={handleRequestStockNotification}
      />

      {/* Renderizar contenido del producto */}
      <ProductContentWithVariants
        product={productToUse}
        onVariantsReady={setVariantsReady}
        onProductSelectionChange={handleProductSelectionChange}
        productSelection={productSelection}
        onNotifyStock={stockNotification.openModal}
      />
    </>
  );
}
