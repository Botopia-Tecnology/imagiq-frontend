// Sección principal de detalles de producto - Refactorizado
import React from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSelectedColor } from "@/contexts/SelectedColorContext";
import { useDeviceVariants, type ColorOption } from "@/hooks/useDeviceVariants";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/features/products/useProducts";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import type { StaticImageData } from "next/image";
import fallbackImage from "@/img/dispositivosmoviles/cel1.png";
import { getProductSeries, getSeriesHref } from "./utils/productSeriesUtils";

// Components
import FloatingEntregoEstrenoButton from "./FloatingEntregoEstrenoButton";
import StickyPriceBar from "./StickyPriceBar";
import ImageGalleryModal from "./ImageGalleryModal";
import ProductHeader from "./ProductHeader";
import ProductSelectors from "./ProductSelectors";
import DeliveryTradeInOptions from "./DeliveryTradeInOptions";
import StickyImageContainer from "./StickyImageContainer";
import PriceAndActions from "./PriceAndActions";
import DeviceCarousel from "./DeviceCarousel";
import AddiFinancing from "./AddiFinancing";

const DetailsProductSection: React.FC<{ product: ProductCardProps }> = ({ product }) => {
  // Hooks
  const {
    colorOptions,
    storageOptions,
    selectedDevice,
    selectedStorage,
    selectedColor,
    selectedVariant,
    currentPrice,
    loading: variantsLoading,
    setSelectedColor,
    setSelectedStorage,
  } = useDeviceVariants(product.id);

  const { setSelectedColor: setGlobalSelectedColor } = useSelectedColor();
  const { addProduct } = useCartContext();
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite: checkIsFavorite } = useFavorites();

  // Detectar serie dinámica del producto
  const productSeries = React.useMemo(() => getProductSeries(product.name), [product.name]);
  const seriesHref = React.useMemo(() => getSeriesHref(productSeries), [productSeries]);

  // State
  const [loading, setLoading] = React.useState(false);
  const isFavorite = checkIsFavorite(product.id);
  const [deliveryOption, setDeliveryOption] = React.useState<"standard" | "express">("standard");
  const [estrenoYEntrego, setEstrenoYEntrego] = React.useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryImages, setGalleryImages] = React.useState<(string | StaticImageData)[]>([]);
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  // Handlers
  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const handleColorSelection = (colorOption: ColorOption) => {
    setSelectedColor(colorOption);
    if (colorOption?.hex) setGlobalSelectedColor(colorOption.hex);
  };

  const handleImageClick = (images: (string | StaticImageData)[], index: number) => { setGalleryImages(images); setGalleryIndex(index); setIsGalleryOpen(true); };

  const hasStock = () => {
    if (!selectedDevice || !selectedStorage || !selectedColor) return true;
    const variant = selectedColor.variants.find(
      (v) =>
        v.nombreMarket === selectedDevice.nombreMarket &&
        v.capacidad === selectedStorage.capacidad &&
        v.color.toLowerCase() === selectedColor.color.toLowerCase()
    );
    return variant ? variant.stock > 0 : false;
  };

  const handleAddToCart = async () => {
    if (!selectedStorage || !selectedColor || !selectedDevice) {
      alert("Por favor selecciona todas las opciones del producto");
      return;
    }

    // Validación estricta: debe existir un SKU válido del variant seleccionado
    if (!selectedVariant?.sku) {
      console.error('Error al agregar al carrito:', {
        product_id: product.id,
        product_name: product.name,
        selectedColor,
        selectedStorage,
        selectedDevice,
        selectedVariant,
        error: 'No se encontró un SKU válido para la variante seleccionada'
      });
      alert('Error: No se encontró el SKU del producto seleccionado. Por favor intenta con otra combinación.');
      return;
    }

    setLoading(true);
    try {
      addProduct({
        id: product.id,
        name: `${product.name} - ${selectedColor.color} - ${selectedStorage.capacidad}`,
        price: currentPrice || 0,
        quantity: 1,
        image: selectedVariant.imagePreviewUrl || (typeof product.image === "string" ? product.image : fallbackImage.src),
        sku: selectedVariant.sku, // SKU estricto de la variante seleccionada
        puntos_q: product.puntos_q ?? 4,
      });
      alert("Producto añadido al carrito");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error al añadir al carrito");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => { await handleAddToCart(); router.push("/cart"); };

  // Animations and effects
  const desktopReveal = useScrollReveal<HTMLDivElement>({ offset: 80, duration: 600, direction: "up" });

  // Price calculations
  const originalPrice = React.useMemo(() => {
    if (selectedVariant?.precioNormal && selectedVariant?.precioDescto) {
      return typeof selectedVariant.precioNormal === 'number' ? selectedVariant.precioNormal : parseInt(String(selectedVariant.precioNormal).replace(/[^\d]/g, ''), 10) || 0;
    }
    if (!product.originalPrice) {
      return undefined;
    }
    const parsedOriginalPrice =
      typeof product.originalPrice === 'number'
        ? product.originalPrice
        : parseInt(String(product.originalPrice).replace(/[^\d]/g, ''), 10) || 0;
    return parsedOriginalPrice;
  }, [selectedVariant, product.originalPrice]);

  const parsedProductDiscount = React.useMemo(() => {
    if (!product.discount) {
      return undefined;
    }
    if (typeof product.discount === "number") {
      return product.discount;
    }
    const parsedValue = parseInt(String(product.discount).replace(/[^\d]/g, ""), 10);
    return parsedValue || 0;
  }, [product.discount]);

  const discountAmount = React.useMemo(() => {
    if (originalPrice && currentPrice) {
      return originalPrice - currentPrice;
    }
    return parsedProductDiscount;
  }, [originalPrice, currentPrice, parsedProductDiscount]);

  return (
    <>
      <FloatingEntregoEstrenoButton />
      <StickyPriceBar
        deviceName={product.name}
        basePrice={currentPrice || 0}
        originalPrice={originalPrice}
        selectedColor={selectedColor?.color}
        selectedStorage={selectedStorage?.capacidad}
        onBuyClick={handleBuyNow}
        hasAddiFinancing={true}
      />
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        currentIndex={galleryIndex}
        productName={product.name}
      />

      <main className="w-full bg-white min-h-screen" style={{ fontFamily: "SamsungSharpSans" }}>
        <motion.section ref={desktopReveal.ref} {...desktopReveal.motionProps} className="hidden lg:block">
          <div className="max-w-[1400px] mx-auto px-8 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-sm text-gray-600">
              <a href={seriesHref} className="hover:text-gray-900">{productSeries}</a>
              <span>/</span>
              <span className="text-gray-900">Detalles del producto</span>
            </nav>

            <div className="grid grid-cols-12 gap-16 items-start">
              {/* Imagen a la izquierda */}
              <div className="col-span-6 sticky top-20 self-start">
                <StickyImageContainer
                  productName={product.name}
                  imagePreviewUrl={selectedVariant?.imagePreviewUrl}
                  imageDetailsUrls={selectedVariant?.imageDetailsUrls}
                  onImageClick={handleImageClick}
                />
              </div>

              {/* Información del producto a la derecha */}
              <div className="col-span-6 flex flex-col justify-start gap-4 min-h-full pb-12 pt-4">
                <header className="">
                  <ProductHeader
                    name={product.name}
                    sku={selectedVariant?.sku ?? product.sku ?? undefined}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  <ProductSelectors
                    colorOptions={colorOptions}
                    selectedColor={selectedColor}
                    onColorChange={handleColorSelection}
                    hasStock={hasStock}
                    storageOptions={storageOptions}
                    selectedStorage={selectedStorage}
                    onStorageChange={setSelectedStorage}
                    variantsLoading={variantsLoading}
                  />
                  <DeliveryTradeInOptions
                    deliveryOption={deliveryOption}
                    onDeliveryChange={setDeliveryOption}
                    estrenoYEntrego={estrenoYEntrego}
                    onEstrenoChange={setEstrenoYEntrego}
                  />
                  <p className="text-base text-[#222] font-light leading-relaxed mb-8">{product.description || ""}</p>
                </header>

                <AddiFinancing
                  productName={product.name}
                  selectedColor={selectedColor?.color}
                  selectedStorage={selectedStorage?.capacidad}
                  currentPrice={currentPrice || undefined}
                  originalPrice={originalPrice || undefined}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* MOBILE: Stack vertical */}
        <motion.section className="lg:hidden">
          <div className="px-4 py-8 max-w-md mx-auto">
            <DeviceCarousel
              alt={product.name}
              imagePreviewUrl={selectedVariant?.imagePreviewUrl}
              imageDetailsUrls={selectedVariant?.imageDetailsUrls}
              onImageClick={handleImageClick}
            />
            <header className="mb-4 text-center mt-6">
              <h1 className="text-2xl font-bold text-[#222] mb-2">{product.name}</h1>
              <p className="text-base text-[#222] mb-4 font-light leading-snug">{product.description || ""}</p>
            </header>
            <PriceAndActions
              currentPrice={currentPrice || 0}
              originalPrice={originalPrice}
              discount={discountAmount}
              selectedVariant={selectedVariant}
              loading={loading}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
            />
            <ProductSelectors
              colorOptions={colorOptions}
              selectedColor={selectedColor}
              onColorChange={handleColorSelection}
              hasStock={hasStock}
              storageOptions={storageOptions}
              selectedStorage={selectedStorage}
              onStorageChange={setSelectedStorage}
              variantsLoading={variantsLoading}
            />
          </div>
        </motion.section>
      </main>
    </>
  );
};

export default DetailsProductSection;
