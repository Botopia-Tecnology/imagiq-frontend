"use client";

import React, { use } from "react";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import ViewPremiumSkeleton from "./ViewPremiumSkeleton";
import StickyPriceBar from "@/app/productos/dispositivos-moviles/detalles-producto/StickyPriceBar";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useProductSelection } from "@/hooks/useProductSelection";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import fallbackImage from "@/img/dispositivosmoviles/cel1.png";
import StockNotificationModal from "@/components/StockNotificationModal";
import { useStockNotification } from "@/hooks/useStockNotification";

// Componentes
import ProductCarousel from "../components/ProductCarousel";
import ProductInfo from "../components/ProductInfo";
import ImageModal from "../components/ImageModal";
import TradeInSection from "../components/sections/TradeInSection";
import { useProductLogic } from "../hooks/useProductLogic";
import BenefitsSection from "../../dispositivos-moviles/detalles-producto/BenefitsSection";
import Specifications from "../../dispositivos-moviles/detalles-producto/Specifications";
import AddToCartButton from "../components/AddToCartButton";

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
  const { product, loading, error } = useProduct(id ?? "");
  const [showContent, setShowContent] = React.useState(false);

  // Hook personalizado para manejar toda la lógica del producto
  const {
    selectedColor,
    selectedStorage,
    selectedRam,
    currentImageIndex,
    showStickyCarousel,
    isModalOpen,
    modalImageIndex,
    slideDirection,
    carouselRef,
    specsRef,
    premiumImages,
    productImages,
    detailImages,
    setSelectedColor,
    setSelectedStorage,
    setSelectedRam,
    setCurrentImageIndex,
    openModal,
    closeModal,
    goToNextImage,
    goToPrevImage,
    goToImage,
  } = useProductLogic(product);

  // Hook para manejo inteligente de selección de productos - compartido entre componentes
  const productSelection = useProductSelection(
    product?.apiProduct || {
      codigoMarketBase: product?.id || "",
      codigoMarket: [],
      nombreMarket: product?.name || "",
      categoria: "",
      subcategoria: "",
      modelo: "",
      color: [],
      capacidad: [],
      memoriaram: [],
      descGeneral: null,
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

  // Hooks para carrito y navegación
  const { addProduct } = useCartContext();
  const router = useRouter();
  const [loadingCart, setLoadingCart] = React.useState(false);

  // Hook para notificación de stock
  const stockNotification = useStockNotification();

  // Handler para añadir al carrito con los datos correctos del productSelection
  const handleAddToCart = async () => {
    if (!product) return;

    if (!productSelection.selectedSku) {
      alert("Por favor selecciona todas las opciones del producto");
      return;
    }

    setLoadingCart(true);
    try {
      await addProduct({
        id: product.id,
        name: product.name,
        price: productSelection.selectedPrice || 0,
        originalPrice: productSelection.selectedOriginalPrice || undefined,
        stock: productSelection.selectedStockTotal ?? 1,
        quantity: 1,
        image:
          productSelection.selectedVariant?.imagePreviewUrl ||
          (typeof product.image === "string"
            ? product.image
            : fallbackImage.src),
        sku: productSelection.selectedSku,
        ean: productSelection.selectedVariant?.ean || "",
        puntos_q: product.puntos_q ?? 4,
        color: productSelection.getSelectedColorOption()?.hex || undefined,
        colorName: productSelection.getSelectedColorOption()?.nombreColorDisplay || productSelection.selection.selectedColor || undefined,
        capacity: productSelection.selection.selectedCapacity || undefined,
        ram: productSelection.selection.selectedMemoriaram || undefined,
        skuPostback: productSelection.selectedSkuPostback || '',
        desDetallada: productSelection.selectedVariant?.desDetallada
      });
    } finally {
      setLoadingCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    
  };

  const hasStock = () => {
    return (
      productSelection.selectedStockTotal !== null &&
      productSelection.selectedStockTotal > 0
    );
  };

  // Handler para solicitar notificación de stock
  const handleRequestStockNotification = async (email: string) => {
    if (!product) return;

    // Obtener el SKU del color seleccionado
    const selectedColorSku = productSelection.selectedSku || undefined;

    // Obtener el codigoMarket correspondiente a la variante seleccionada
    const codigoMarket = productSelection.selectedCodigoMarket || product.apiProduct?.codigoMarketBase || '';

    await stockNotification.requestNotification({
      productName: product.name,
      email,
      sku: selectedColorSku,
      codigoMarket,
    });
  };

  // Barra sticky superior con la misma animación/estilo de la vista normal
  const showStickyBar = useScrollNavbar(150, 50, true);

  // Efecto para ocultar/mostrar el header principal exactamente igual que en view normal
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

  // Delay para asegurar transición suave
  React.useEffect(() => {
    if (!loading && product) {
      const timer = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [loading, product]);

  if (!id) {
    return notFound();
  }
  if (loading || !showContent) {
    return <ViewPremiumSkeleton />;
  }
  if (error) {
    return notFound();
  }
  if (!product) {
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

  // Obtener indcerointeres del producto (puede venir como array del API)
  const getIndcerointeres = (): number => {
    // Si el producto tiene apiProduct (datos del API)
    if (product.apiProduct?.indcerointeres) {
      const indcerointeresArray = product.apiProduct.indcerointeres;
      // Tomar el primer valor del array, si no existe usar 0
      return indcerointeresArray[0] ?? 0;
    }
    // Fallback a 0 si no existe
    return 0;
  };

  const indcerointeres = getIndcerointeres();

  return (
    <>
      {/* StickyPriceBar exacto de la página view normal */}
      <StickyPriceBar
        deviceName={product.name}
        basePrice={productSelection.selectedPrice || (() => {
          const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
          const priceStr = selectedCapacity?.price || product.price || "0";
          return Number.parseInt(String(priceStr).replaceAll(/\D/g, ''), 10);
        })()}
        selectedStorage={productSelection.selection.selectedCapacity || ((selectedStorage || undefined) && String(selectedStorage).replace(/(\d+)\s*gb\b/i, '$1 GB'))}
        selectedColor={
          productSelection.getSelectedColorOption()?.nombreColorDisplay ||
          productSelection.selection.selectedColor ||
          (() => {
            const colorObj = product.colors?.find(c => c.name === selectedColor);
            return colorObj?.nombreColorDisplay || colorObj?.label || selectedColor || undefined;
          })()
        }
        indcerointeres={indcerointeres}
        allPrices={product.apiProduct?.precioeccommerce || []}
        isVisible={showStickyBar}
        onBuyClick={handleBuyNow}
        hasStock={hasStock()}
        onNotifyStock={stockNotification.openModal}
      />

      {/* Layout de dos columnas: Carrusel sin márgenes, Info con márgenes */}
      <div className="bg-white pt-8 pb-0 mb-0 min-h-screen">
        {/* Breadcrumbs */}
        <div className="px-4 md:px-6 lg:px-12 mb-4">
          <Breadcrumbs productName="Detalles del producto" />
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start relative">
          {/* Columna izquierda: Carrusel - ocupa el ancho */}
          <div className="lg:col-span-9 lg:sticky lg:top-24 self-start lg:h-screen overflow-hidden">
            <ProductCarousel
              ref={carouselRef}
              product={product}
              selectedColor={selectedColor}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              showStickyCarousel={showStickyCarousel}
              premiumImages={premiumImages}
              productImages={productImages}
              onOpenModal={openModal}
              setSelectedColor={setSelectedColor}
            />
          </div>

          {/* Columna derecha: Información del producto con márgenes normales - SCROLLEABLE */}
          <div className="lg:col-span-3 px-4 md:px-6 lg:px-12 mt-0 lg:mt-0 lg:min-h-[200vh]">
            <div className="max-w-7xl mx-auto">
              <ProductInfo
                ref={specsRef}
                product={product}
                selectedColor={selectedColor}
                selectedStorage={selectedStorage}
                selectedRam={selectedRam}
                indcerointeres={indcerointeres}
                setSelectedColor={setSelectedColor}
                setSelectedStorage={setSelectedStorage}
                setSelectedRam={setSelectedRam}
                setCurrentImageIndex={setCurrentImageIndex}
                currentImageIndex={currentImageIndex}
                productImages={productImages}
                onOpenModal={openModal}
                productSelection={productSelection}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Estreno y Entrego - SIEMPRE fuera del grid, centrada */}
      <div className="bg-white pb-4 mt-8 lg:-mt-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <TradeInSection
              onTradeInComplete={(deviceName, value) => {
                console.log('Trade-in completado:', deviceName, value);
                // Aquí puedes agregar lógica adicional si necesitas hacer algo cuando se completa el trade-in
              }}
            />
          </div>
        </div>
      </div>

      {/* Beneficios imagiq - Banner que ocupa el ancho */}
      <BenefitsSection />

      {/* Especificaciones y Flix Media */}
      <div className="relative flex items-center justify-center w-full min-h-[100px] py-0 -mt-8">
        <Specifications product={product} flix={product} />
      </div>

      {/* Botón de añadir al carrito al final de la página */}
      <AddToCartButton
        product={product}
        productSelection={productSelection}
        onNotifyStock={stockNotification.openModal}
      />

      {/* Modal de notificación de stock */}
      <StockNotificationModal
        isOpen={stockNotification.isModalOpen}
        onClose={stockNotification.closeModal}
        productName={product.name}
        productImage={
          productSelection.selectedVariant?.imagePreviewUrl ||
          (typeof product.image === "string"
            ? product.image
            : fallbackImage.src)
        }
        selectedColor={productSelection.getSelectedColorOption()?.nombreColorDisplay || productSelection.selection.selectedColor || undefined}
        selectedStorage={productSelection.selection.selectedCapacity || undefined}
        onNotificationRequest={handleRequestStockNotification}
      />

      {/* Modal para fotos del color seleccionado */}
      <ImageModal
        isOpen={isModalOpen}
        productImages={detailImages}
        modalImageIndex={modalImageIndex}
        slideDirection={slideDirection}
        product={product}
        selectedColor={selectedColor}
        onClose={closeModal}
        onNextImage={goToNextImage}
        onPrevImage={goToPrevImage}
        onGoToImage={goToImage}
      />
      {/* Estilos globales para animación de ocultar header, idénticos a view normal */}
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
