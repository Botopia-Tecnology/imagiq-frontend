// Sección principal de detalles de producto - Refactorizado
import React from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import { useSelectedColor } from "@/contexts/SelectedColorContext";
import { useProductSelection } from "@/hooks/useProductSelection";
import { useShippingOrigin } from "@/hooks/useShippingOrigin";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/features/products/useProducts";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import type { StaticImageData } from "next/image";
import fallbackImage from "@/img/dispositivosmoviles/cel1.png";
import { Breadcrumbs } from "@/components/breadcrumbs";

// Components
import StickyPriceBar from "./StickyPriceBar";
import ImageGalleryModal from "./ImageGalleryModal";
import { TradeInModal } from "./estreno-y-entrego";
import ProductHeader from "./ProductHeader";
import ProductSelectors from "./ProductSelectors";
import DeliveryTradeInOptions from "./DeliveryTradeInOptions";
import StickyImageContainer from "./StickyImageContainer";
import PriceAndActions from "./PriceAndActions";
import DeviceCarousel from "./DeviceCarousel";
import AddiFinancing from "./AddiFinancing";
import ARExperienceHandler from "../../electrodomesticos/components/ARExperienceHandler";

const DetailsProductSection: React.FC<{
  product: ProductCardProps;
  onVariantsReady?: (ready: boolean) => void;
}> = ({ product, onVariantsReady }) => {
  // Hooks - Usar el mismo sistema que ProductCard
  const productSelection = useProductSelection(product.apiProduct || {
    codigoMarketBase: product.id,
    codigoMarket: [],
    nombreMarket: product.name,
    categoria: '',
    subcategoria: '',
    modelo: '',
    color: product.colors?.map(c => c.label) || [],
    capacidad: product.capacities?.map(c => c.label) || [],
    memoriaram: [],
    descGeneral: null,
    sku: [],
    ean: [],
    desDetallada: [],
    stock: [],
    stockTotal: [],
    urlImagenes: [],
    urlRender3D: [],
    imagePreviewUrl: [],
    imageDetailsUrls: [],
    precioNormal: [],
    precioeccommerce: [],
    fechaInicioVigencia: [],
    fechaFinalVigencia: []
  });

  // Notificar cuando las variantes estén listas (usando productSelection)
  // No dependemos de loading porque productSelection siempre tiene una variante seleccionada
  React.useEffect(() => {
    if (productSelection.selectedVariant && onVariantsReady) {
      onVariantsReady(true);
    }
  }, [productSelection.selectedVariant, onVariantsReady]);

  const { setSelectedColor: setGlobalSelectedColor } = useSelectedColor();
  const { addProduct } = useCartContext();
  const { shouldShowShippingOrigin } = useShippingOrigin();
  const router = useRouter();
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite: checkIsFavorite,
  } = useFavorites();

  // Control de scroll para StickyPriceBar
  const showStickyBar = useScrollNavbar(50, 50, true); //150

  // State
  const [loading, setLoading] = React.useState(false);
  const isFavorite = checkIsFavorite(product.id);
  const [deliveryOption, setDeliveryOption] = React.useState<
    "standard" | "express"
  >("standard");
  const [estrenoYEntrego, setEstrenoYEntrego] = React.useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryImages, setGalleryImages] = React.useState<
    (string | StaticImageData)[]
  >([]);
  const [galleryIndex, setGalleryIndex] = React.useState(0);
  const [isTradeInModalOpen, setIsTradeInModalOpen] = React.useState(false);
  const [tradeInCompleted, setTradeInCompleted] = React.useState(false);
  const [tradeInDeviceName, setTradeInDeviceName] = React.useState<string>("");
  const [tradeInValue, setTradeInValue] = React.useState<number>(0);

  // Handlers
  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  // Funciones de manejo de selección compatibles con el diseño actual
  const handleColorSelection = (colorName: string) => {
    productSelection.selectColor(colorName);
    // Buscar el hex del color para el contexto global
    const colorInfo = product.colors?.find(c => c.label === colorName);
    if (colorInfo?.hex) setGlobalSelectedColor(colorInfo.hex);
  };

  const handleStorageSelection = (capacityName: string) => {
    productSelection.selectCapacity(capacityName);
  };

  const handleMemoriaramSelection = (memoriaramName: string) => {
    productSelection.selectMemoriaram(memoriaramName);
  };

  const handleImageClick = (
    images: (string | StaticImageData)[],
    index: number
  ) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleOpenTradeInModal = () => {
    setIsTradeInModalOpen(true);
  };

  const handleCloseTradeInModal = () => {
    setIsTradeInModalOpen(false);
  };

  const handleCancelTradeIn = () => {
    // Resetear a NO cuando se cierra sin completar
    setEstrenoYEntrego(false);
    setTradeInCompleted(false);
  };

  const handleCompleteTradeIn = (deviceName: string, value: number) => {
    // Guardar la información cuando se completa el proceso
    setTradeInCompleted(true);
    setTradeInDeviceName(deviceName);
    setTradeInValue(value);
    setEstrenoYEntrego(true);
  };

  const hasStock = () => {
    return productSelection.selectedStockTotal !== null && productSelection.selectedStockTotal > 0;
  };

  const handleAddToCart = async () => {
    if (!productSelection.selectedSku) {
      alert("Por favor selecciona todas las opciones del producto");
      return;
    }
    setLoading(true);
    try {
      addProduct({
        id: product.id,
        name: product.name,
        price: productSelection.selectedPrice || 0,
        originalPrice: productSelection.selectedOriginalPrice || undefined,
        stock: productSelection.selectedStockTotal || product.stock || 1,
        shippingFrom: shouldShowShippingOrigin ? "Bogotá" : undefined,
        quantity: 1,
        image: productSelection.selectedVariant?.imagePreviewUrl || (typeof product.image === "string" ? product.image : fallbackImage.src),
        sku: productSelection.selectedSku,
        ean: productSelection.selectedVariant?.ean || '',
        puntos_q: product.puntos_q ?? 4,
        color: productSelection.selection.selectedColor || undefined,
        capacity: productSelection.selection.selectedCapacity || undefined,
        ram: productSelection.selection.selectedMemoriaram || undefined,
      });
      alert("Producto añadido al carrito");
    } catch (error) {
      alert("Error al añadir al carrito");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/cart");
  };

  // Helper functions for price calculations
  const getCurrentPrice = () => {
    if (typeof productSelection.selectedPrice === 'number') {
      return productSelection.selectedPrice;
    }
    if (typeof product.price === 'number') {
      return product.price;
    }
    return 0;
  };

  // Efecto para controlar el navbar principal cuando aparece el StickyPriceBar
  React.useEffect(() => {
    if (typeof document === "undefined") return; // Protección SSR

    if (showStickyBar) {
      // Inmediatamente ocultar navbar principal cuando aparece el sticky bar
      document.body.classList.add("hide-main-navbar");
    } else {
      // Delay optimizado para permitir transición suave
      const timer = setTimeout(() => {
        document.body.classList.remove("hide-main-navbar");
      }, 250);

      return () => clearTimeout(timer);
    }

    // Cleanup: siempre remover la clase al desmontar
    return () => {
      document.body.classList.remove("hide-main-navbar");
    };
  }, [showStickyBar]);

  // Animations and effects
  const desktopReveal = useScrollReveal<HTMLDivElement>({
    offset: 80, //80
    duration: 600,
    direction: "up",
  });

  // Price calculations
  const originalPrice = React.useMemo(() => {
    if (productSelection.selectedOriginalPrice) {
      return productSelection.selectedOriginalPrice;
    }
    if (!product.originalPrice) {
      return undefined;
    }
    const parsedOriginalPrice =
      typeof product.originalPrice === "number"
        ? product.originalPrice
        : Number.parseInt(String(product.originalPrice).replaceAll(/[^\d]/g, ''), 10) || 0;
    return parsedOriginalPrice;
  }, [productSelection.selectedOriginalPrice, product.originalPrice]);

  const parsedProductDiscount = React.useMemo(() => {
    if (productSelection.selectedDiscount) {
      return productSelection.selectedDiscount;
    }
    if (!product.discount) {
      return undefined;
    }
    if (typeof product.discount === "number") {
      return product.discount;
    }
    const parsedValue = Number.parseInt(String(product.discount).replaceAll(/[^\d]/g, ""), 10);
    return parsedValue || 0;
  }, [productSelection.selectedDiscount, product.discount]);

  const discountAmount = React.useMemo(() => {
    if (originalPrice && productSelection.selectedPrice) {
      return originalPrice - productSelection.selectedPrice;
    }
    return parsedProductDiscount;
  }, [originalPrice, productSelection.selectedPrice, parsedProductDiscount]);

  return (
    <>
      <StickyPriceBar
        deviceName={product.name}
        basePrice={getCurrentPrice()}
        originalPrice={originalPrice}
        selectedColor={productSelection.selection.selectedColor || undefined}
        selectedStorage={productSelection.selection.selectedCapacity || undefined}
        onBuyClick={handleBuyNow}
        hasAddiFinancing={true}
        isVisible={showStickyBar}
      />
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        currentIndex={galleryIndex}
        productName={product.name}
      />
      <TradeInModal
        isOpen={isTradeInModalOpen}
        onClose={handleCloseTradeInModal}
        onCancelWithoutCompletion={handleCancelTradeIn}
        onCompleteTradeIn={handleCompleteTradeIn}
      />

      <main
        className="w-full bg-white min-h-screen pt-[75px] xl:pt-[75px]"
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        <motion.section
          ref={desktopReveal.ref}
          {...desktopReveal.motionProps}
          className="hidden lg:block"
        >
          <div className="max-w-[1400px] mx-auto px-8 py-12">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumbs productName="Detalles del producto" />
            </div>

            <div className="grid grid-cols-12 gap-16 items-start">
              {/* Imagen a la izquierda */}
              <div className="col-span-6 sticky top-20 self-start">
                <StickyImageContainer
                  productName={product.name}
                  imagePreviewUrl={productSelection.selectedVariant?.imagePreviewUrl}
                  imageDetailsUrls={product.apiProduct?.imageDetailsUrls?.[productSelection.selectedVariant?.index || 0] || []}
                  onImageClick={handleImageClick}
                />
                {productSelection.selectedVariant?.urlRender3D && productSelection.selectedVariant.urlRender3D.trim() != "" && (
                  <ARExperienceHandler
                    glbUrl={productSelection.selectedVariant.urlRender3D}
                    usdzUrl={productSelection.selectedVariant.urlRender3D}
                  />
                )}
              </div>

              {/* Información del producto a la derecha */}
              <div className="col-span-6 flex flex-col justify-start gap-4 min-h-full pb-12 pt-4">
                <header className="">
                  <ProductHeader
                    name={product.name}
                    sku={productSelection.selectedSku ?? undefined}
                    codigoMarket={productSelection.selectedCodigoMarket ?? undefined}
                    stock={productSelection.selectedStock ?? undefined}
                    stockTotal={productSelection.selectedStockTotal ?? undefined}
                    rating={undefined}
                    reviewCount={undefined}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <ProductSelectors
                    colorOptions={productSelection.getColorOptions()}
                    selectedColor={productSelection.getSelectedColorOption()}
                    onColorChange={(colorOption) => handleColorSelection(colorOption.color)}
                    hasStock={hasStock}
                    storageOptions={productSelection.getStorageOptions()}
                    selectedStorage={productSelection.getSelectedStorageOption()}
                    onStorageChange={(storageOption) => handleStorageSelection(storageOption.capacidad)}
                    variantsLoading={false}
                    memoriaramOptions={productSelection.availableMemoriaram}
                    selectedMemoriaram={productSelection.selection.selectedMemoriaram}
                    onMemoriaramChange={handleMemoriaramSelection}
                    onOpenTradeInModal={handleOpenTradeInModal}
                    tradeInSelected={estrenoYEntrego}
                    onTradeInChange={setEstrenoYEntrego}
                    tradeInCompleted={tradeInCompleted}
                    tradeInDeviceName={tradeInDeviceName}
                    tradeInValue={tradeInValue}
                  />

                  <DeliveryTradeInOptions
                    deliveryOption={deliveryOption}
                    onDeliveryChange={setDeliveryOption}
                  />
                  <p className="text-base text-[#222] font-light leading-relaxed mb-8">
                    {/* Description removed from ProductCardProps */}
                  </p>
                </header>

                <AddiFinancing
                  productName={product.name}
                  selectedColor={productSelection.selection.selectedColor || undefined}
                  selectedStorage={productSelection.selection.selectedCapacity || undefined}
                  currentPrice={getCurrentPrice()}
                  originalPrice={originalPrice}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* MOBILE: Stack vertical */}
        <motion.section className="lg:hidden">
          <div className="px-4 pt-8 pb-8 max-w-md mx-auto">
            {/* Breadcrumb móvil */}
            <div className="mb-4">
              <Breadcrumbs productName="Detalles del producto" />
            </div>

            <DeviceCarousel
              alt={product.name}
              imagePreviewUrl={productSelection.selectedVariant?.imagePreviewUrl}
              imageDetailsUrls={product.apiProduct?.imageDetailsUrls?.[productSelection.selectedVariant?.index || 0] || []}
              onImageClick={handleImageClick}
            />
            <header className="mb-4 text-center mt-6">
              <h1 className="text-2xl font-bold text-[#222] mb-2">
                {product.name}
              </h1>
              <p className="text-base text-[#222] mb-4 font-light leading-snug">
                {/* Description removed from ProductCardProps */}
              </p>
              {productSelection.selectedVariant?.urlRender3D && productSelection.selectedVariant.urlRender3D.trim() != "" && (
                <ARExperienceHandler
                  glbUrl={productSelection.selectedVariant.urlRender3D}
                  usdzUrl={productSelection.selectedVariant.urlRender3D}
                />
              )}
            </header>

            <PriceAndActions
              currentPrice={getCurrentPrice()}
              originalPrice={originalPrice}
              discount={discountAmount}
              selectedVariant={productSelection.selectedVariant}
              loading={loading}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
            />
            <ProductSelectors
              colorOptions={productSelection.getColorOptions()}
              selectedColor={productSelection.getSelectedColorOption()}
              onColorChange={(colorOption) => handleColorSelection(colorOption.color)}
              hasStock={hasStock}
              storageOptions={productSelection.getStorageOptions()}
              selectedStorage={productSelection.getSelectedStorageOption()}
              onStorageChange={(storageOption) => handleStorageSelection(storageOption.capacidad)}
              variantsLoading={false}
              memoriaramOptions={productSelection.availableMemoriaram}
              selectedMemoriaram={productSelection.selection.selectedMemoriaram}
              onMemoriaramChange={handleMemoriaramSelection}
              onOpenTradeInModal={handleOpenTradeInModal}
              tradeInSelected={estrenoYEntrego}
              onTradeInChange={setEstrenoYEntrego}
              tradeInCompleted={tradeInCompleted}
              tradeInDeviceName={tradeInDeviceName}
              tradeInValue={tradeInValue}
            />
          </div>
        </motion.section>
      </main>

      {/* Estilos CSS globales optimizados para transiciones cinematográficas */}
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

          /* Asegurar que el navbar fijo tenga prioridad visual absoluta */
          .fixed-navbar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            will-change: transform, opacity, filter !important;
          }

          /* Efecto de cristal mejorado para el navbar fijo */
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

          /* Animación de entrada más suave para elementos internos */
          .fixed-navbar-container * {
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        `,
        }}
      />
    </>
  );
};

export default DetailsProductSection;
