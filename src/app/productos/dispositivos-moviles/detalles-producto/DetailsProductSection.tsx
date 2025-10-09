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
    if (!selectedStorage || !selectedColor || !selectedDevice) return alert("Por favor selecciona todas las opciones del producto");
    setLoading(true);
    try {
      addProduct({
        id: product.id,
        name: `${product.name} - ${selectedColor.color} - ${selectedStorage.capacidad}`,
        price: currentPrice || 0,
        quantity: 1,
        image: selectedVariant?.imagePreviewUrl || (typeof product.image === "string" ? product.image : fallbackImage.src),
        sku: product.sku || `SKU-${product.id}`,
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

  const discountAmount = React.useMemo(() => {
    
    if (originalPrice && currentPrice) {
      return originalPrice - currentPrice;
    }
    return undefined;
  }, [originalPrice, currentPrice]);

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
          <div className="max-w-[1280px] mx-auto px-12 py-20">
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-7 flex flex-col justify-start gap-6 min-h-full pb-12">
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
                  {/* <p className="text-base text-[#222] font-light leading-relaxed mb-8">{product.description || ""}</p> */}
                </header>

                <AddiFinancing 
                  productName={product.name}
                  selectedColor={selectedColor?.color}
                  selectedStorage={selectedStorage?.capacidad}
                  currentPrice={currentPrice || undefined}
                  originalPrice={originalPrice || undefined}
                />
              </div>

              <div className="col-span-5 sticky top-16 self-start">
                <StickyImageContainer
                  productName={product.name}
                  imagePreviewUrl={selectedVariant?.imagePreviewUrl}
                  imageDetailsUrls={selectedVariant?.imageDetailsUrls}
                  onImageClick={handleImageClick}
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
              {/* <p className="text-base text-[#222] mb-4 font-light leading-snug">{product.description || ""}</p> */}
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
