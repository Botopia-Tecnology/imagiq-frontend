"use client";

import React, { use, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import smartphonesImg from "@/img/dispositivosmoviles/cel1.png";
import { ProductCardProps } from "@/app/productos/components/ProductCard";
import type {
  ProductVariant,
  ColorOption,
} from "@/hooks/useProductSelection";
import { useProductSelection } from "@/hooks/useProductSelection";
import DetailsProductSection from "@/app/productos/dispositivos-moviles/detalles-producto/DetailsProductSection";
import ProductDetailSkeleton from "@/app/productos/dispositivos-moviles/detalles-producto/ProductDetailSkeleton";
import AddToCartButton from "../../viewpremium/components/AddToCartButton";
import StockNotificationModal from "@/components/StockNotificationModal";
import { useStockNotification } from "@/hooks/useStockNotification";
import { useAnalytics } from "@/lib/analytics/hooks/useAnalytics";
import { useTradeInPrefetch } from "@/hooks/useTradeInPrefetch";
import { Breadcrumbs } from "@/components/breadcrumbs";
import StickyPriceBar from "@/app/productos/dispositivos-moviles/detalles-producto/StickyPriceBar";
import QuickNavBar from "../../viewpremium/[id]/components/QuickNavBar";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import BenefitsSection from "../../dispositivos-moviles/detalles-producto/BenefitsSection";
import TradeInSection from "../../viewpremium/components/sections/TradeInSection";

// Lazy load FlixmediaPlayer
const FlixmediaPlayer = lazy(() => import("@/components/FlixmediaPlayer"));

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
  hideBreadcrumbs = false,
}: {
  product: ProductCardProps;
  onVariantsReady: (ready: boolean) => void;
  onProductSelectionChange?: (selection: ProductSelectionData) => void;
  productSelection: ProductSelectionData | null;
  onNotifyStock?: () => void;
  hideBreadcrumbs?: boolean;
}) {
  return (
    <>
      <DetailsProductSection
        product={product}
        onVariantsReady={onVariantsReady}
        onProductSelectionChange={onProductSelectionChange}
        hideBreadcrumbs={hideBreadcrumbs}
      />

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
  const [initialProduct] = React.useState<ProductCardProps | null>(() => {
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
            skuflixmedia: parsed.skuflixmedia,
            apiProduct: {
              codigoMarketBase: id,
              codigoMarket: [],
              nombreMarket: [parsed.productName || ""],
              categoria: "Móviles",
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
              skuflixmedia: parsed.skuflixmedia ? [parsed.skuflixmedia] : [],
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
  const [productSelectionState, setProductSelectionState] =
    React.useState<ProductSelectionData | null>(null);
  const [shouldRedirectToPremium, setShouldRedirectToPremium] = React.useState(false);
  const [premiumCheckDone, setPremiumCheckDone] = React.useState(false);
  const stockNotification = useStockNotification();
  const { trackViewItem } = useAnalytics();

  // Hook para manejo inteligente de selección de productos - compartido entre componentes
  const productSelection = useProductSelection(
    product?.apiProduct || {
      codigoMarketBase: product?.id || "",
      codigoMarket: [],
      nombreMarket: product?.name ? [product.name] : [],
      categoria: "",
      subcategoria: "",
      modelo: product?.name ? [product.name] : [],
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
    }
  );

  // Barra sticky superior
  const showStickyBar = useScrollNavbar(150, 50, true);

  // 🚀 Prefetch automático de datos de Trade-In
  useTradeInPrefetch();

  // Efecto para ocultar/mostrar el header principal
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (showStickyBar) {
      document.body.classList.add("hide-main-navbar");
    } else {
      const timer = setTimeout(() => {
        document.body.classList.remove("hide-main-navbar");
      }, 250);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.classList.remove("hide-main-navbar");
    };
  }, [showStickyBar]);

  // 🔄 Verificar si el producto tiene contenido premium y debe redirigir a viewpremium
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

      if (hasPremium && isPremium) {
        console.log('[VIEW] ➡️ Redirigiendo a viewpremium (tiene segmento Y contenido premium)');
        setShouldRedirectToPremium(true);
        router.replace(`/productos/viewpremium/${id}`);
      } else {
        setPremiumCheckDone(true);
      }
    }
  }, [apiProduct, loading, id, router]);

  // Reset variants ready cuando cambia el producto
  React.useEffect(() => {
    setVariantsReady(false);
  }, [id]);

  // 🔥 Track View Item apenas el producto carga
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, loading]);

  // Callback para recibir productSelection desde DetailsProductSection
  const handleProductSelectionChange = React.useCallback(
    (selection: ProductSelectionData) => {
      setProductSelectionState(selection);
    },
    []
  );

  // Handler para notificación de stock
  const handleRequestStockNotification = async (email: string) => {
    if (!product) return;

    const selectedSku = productSelection.selectedSku || productSelectionState?.selectedSku;
    const codigoMarket =
      productSelection.selectedCodigoMarket ||
      productSelectionState?.selectedVariant?.codigoMarket ||
      product.apiProduct?.codigoMarketBase ||
      "";

    await stockNotification.requestNotification({
      productName: product.name,
      email,
      sku: selectedSku || undefined,
      codigoMarket,
    });
  };

  // Helper para verificar stock
  const hasStock = () => {
    return (
      productSelection.selectedStockTotal !== null &&
      productSelection.selectedStockTotal > 0
    );
  };

  // Obtener indcerointeres del producto
  const getIndcerointeres = (): number => {
    if (product?.apiProduct?.indcerointeres) {
      const indcerointeresArray = product.apiProduct.indcerointeres;
      return indcerointeresArray[0] ?? 0;
    }
    return 0;
  };

  if (!id) {
    return notFound();
  }

  if (loading || shouldRedirectToPremium || (apiProduct && !premiumCheckDone)) {
    return <ProductDetailSkeleton />;
  }

  if (error && !apiProduct) {
    return notFound();
  }

  if (!apiProduct) {
    return notFound();
  }

  const productToUse = apiProduct;
  const indcerointeres = getIndcerointeres();

  return (
    <>
      {/* StickyPriceBar - Barra sticky superior */}
      <StickyPriceBar
        deviceName={productToUse.name}
        basePrice={productSelection.selectedPrice || (() => {
          const priceStr = productToUse.price || "0";
          return Number.parseInt(String(priceStr).replaceAll(/\D/g, ''), 10);
        })()}
        selectedStorage={productSelection.selection.selectedCapacity || undefined}
        selectedColor={
          productSelection.getSelectedColorOption()?.nombreColorDisplay ||
          productSelection.selection.selectedColor ||
          undefined
        }
        indcerointeres={indcerointeres}
        allPrices={productToUse.apiProduct?.precioeccommerce || []}
        isVisible={showStickyBar}
        onBuyClick={() => {}}
        hasStock={hasStock()}
        onNotifyStock={stockNotification.openModal}
      />

      {/* Barra de navegación rápida entre secciones */}
      <QuickNavBar isStickyBarVisible={showStickyBar} />

      {/* SECCIÓN: Comprar - Contenido principal del producto */}
      <section id="comprar-section" className="bg-white pt-12 pb-0 mb-0 min-h-screen scroll-mt-[180px]">
        {/* Breadcrumbs dinámicos desde base de datos */}
        <div className="px-4 lg:px-8 mb-4 pt-24 md:pt-20 xl:pt-20">
          <Breadcrumbs
            productId={id || ""}
            categoryCode={productToUse.apiProduct?.categoria}
            subcategoria={productToUse.apiProduct?.subcategoria}
          />
        </div>

        {/* Modal de notificación de stock */}
        <StockNotificationModal
          isOpen={stockNotification.isModalOpen}
          onClose={stockNotification.closeModal}
          productName={productToUse.name}
          productImage={
            productSelection.selectedVariant?.imagePreviewUrl ||
            productSelectionState?.selectedVariant?.imagePreviewUrl ||
            (typeof productToUse.image === "string"
              ? productToUse.image
              : smartphonesImg.src)
          }
          selectedColor={
            productSelection.getSelectedColorOption()?.nombreColorDisplay ||
            productSelectionState?.getSelectedColorOption?.()?.nombreColorDisplay ||
            productSelectionState?.selection?.selectedColor ||
            undefined
          }
          selectedStorage={
            productSelection.selection.selectedCapacity ||
            productSelectionState?.selection?.selectedCapacity ||
            undefined
          }
          onNotificationRequest={handleRequestStockNotification}
        />

        {/* Renderizar contenido del producto */}
        <ProductContentWithVariants
          product={productToUse}
          onVariantsReady={setVariantsReady}
          onProductSelectionChange={handleProductSelectionChange}
          productSelection={productSelectionState}
          onNotifyStock={stockNotification.openModal}
          hideBreadcrumbs={true}
        />
      </section>

      {/* Sección de Estreno y Entrego */}
      <div className="bg-white pb-2 md:pb-4 mt-[clamp(1rem,4vw,2rem)] relative z-10 clear-both">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <TradeInSection
              onTradeInComplete={(deviceName, value) => {
                console.log('Trade-in completado:', deviceName, value);
              }}
              productSku={productSelection.selectedSku || productSelectionState?.selectedSku || undefined}
              productName={productToUse.name}
              skuPostback={productSelection.selectedSkuPostback || productSelectionState?.selectedSkuPostback || undefined}
            />
          </div>
        </div>
      </div>

      {/* Beneficios imagiq */}
      <BenefitsSection />

      {/* SECCIÓN: Detalles - Contenido multimedia de Flixmedia */}
      <section id="detalles-section" className="bg-white scroll-mt-[180px]">
        <Suspense fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0066CC] rounded-full animate-spin" />
          </div>
        }>
          <FlixmediaPlayer
            mpn={productSelection.selectedSkuflixmedia || productToUse.skuflixmedia || productToUse.apiProduct?.skuflixmedia?.[0]}
            ean={productSelection.selectedVariant?.ean || productSelectionState?.selectedVariant?.ean}
            productName={productToUse.name}
            productId={productToUse.id}
            segmento={productToUse.apiProduct?.segmento}
            apiProduct={productToUse.apiProduct}
            productColors={productToUse.colors}
            preventRedirect={true}
            className="w-full"
          />
        </Suspense>
      </section>

      {/* Estilos globales para animación de ocultar header */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          body.hide-main-navbar header[data-navbar="true"] {
            transform: translateY(-100%) scale(0.97) !important;
            opacity: 0 !important;
            filter: blur(3px) !important;
            transition:
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
            pointer-events: none !important;
          }

          .fixed-navbar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            will-change: transform, opacity, filter !important;
          }

          .fixed-navbar-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            border-radius: inherit;
            pointer-events: none;
          }

          .fixed-navbar-container * {
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        `,
        }}
      />
    </>
  );
}
