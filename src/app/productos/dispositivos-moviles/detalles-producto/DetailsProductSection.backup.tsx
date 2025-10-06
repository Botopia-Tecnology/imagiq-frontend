// Sección principal de detalles de producto
// Ahora recibe el producto real como prop y lo pasa a Specifications y subcomponentes.
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSelectedColor } from "@/contexts/SelectedColorContext";
import { useDeviceVariants, ColorOption } from "@/hooks/useDeviceVariants";
import DeviceCarousel from "./DeviceCarousel";
import ColorSelector from "./ColorSelector";
import FloatingEntregoEstrenoButton from "./FloatingEntregoEstrenoButton";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import StickyPriceBar from "./StickyPriceBar";
import ImageGalleryModal from "./ImageGalleryModal";
import { Heart, Truck, Zap } from "lucide-react";
import type { StaticImageData } from "next/image";

const DetailsProductSection: React.FC<{ product: ProductCardProps }> = ({
  product,
}) => {
  // Hooks de variantes y color global (pueden necesitar adaptación si usan datos mock)
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
  const {
    setSelectedColor: setGlobalSelectedColor,
  } = useSelectedColor();
  const { addProduct } = useCartContext();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [deliveryOption, setDeliveryOption] = React.useState<"standard" | "express">("standard");
  const [estrenoYEntrego, setEstrenoYEntrego] = React.useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryImages, setGalleryImages] = React.useState<(string | StaticImageData)[]>([]);
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  // Sincronización de selección de color
  const handleColorSelection = (colorOption: ColorOption) => {
    setSelectedColor(colorOption);
    if (colorOption?.hex) setGlobalSelectedColor(colorOption.hex);
  };

  // Handler para abrir galería de imágenes
  const handleImageClick = (images: (string | StaticImageData)[], index: number) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  // Stock
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

  // Animaciones
  const desktopReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const mobileReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  const beneficiosReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  // Handler: Añadir al carrito
  const handleAddToCart = async () => {
    if (!selectedDevice || !selectedStorage || !selectedColor) return;
    setLoading(true);
    const variant = selectedColor.variants.find(
      (v) =>
        v.nombreMarket === selectedDevice.nombreMarket &&
        v.capacidad === selectedStorage.capacidad &&
        v.color.toLowerCase() === selectedColor.color.toLowerCase()
    );
    addProduct({
      id: product.id,
      name: product.name,
      image:
        typeof product.image === "string" ? product.image : product.image.src,
      price: (() => {
        const val =
          variant?.precioDescto ?? variant?.precioNormal ?? product.price;
        if (typeof val === "number") return val;
        if (typeof val === "string")
          return parseInt(val.replace(/[^\d]/g, "")) || 0;
        return 0;
      })(),
      sku: variant?.sku || product.sku || product.id,
      puntos_q: product.puntos_q ?? 4,
      quantity: 1,
    });
    setTimeout(() => setLoading(false), 800);
  };

  // Handler: Comprar ahora
  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/carrito");
  };

  // Calcular precio original y descuento
  const originalPrice = React.useMemo(() => {
    if (selectedVariant?.precioNormal && selectedVariant?.precioDescto) {
      const normal = typeof selectedVariant.precioNormal === 'number'
        ? selectedVariant.precioNormal
        : parseInt(String(selectedVariant.precioNormal).replace(/[^\d]/g, '')) || 0;
      return normal;
    }
    return product.originalPrice
      ? (typeof product.originalPrice === 'number'
          ? product.originalPrice
          : parseInt(String(product.originalPrice).replace(/[^\d]/g, '')) || 0)
      : undefined;
  }, [selectedVariant, product.originalPrice]);

  const discountAmount = React.useMemo(() => {
    if (originalPrice && currentPrice) {
      return originalPrice - currentPrice;
    }
    return product.discount
      ? (typeof product.discount === 'number'
          ? product.discount
          : parseInt(String(product.discount).replace(/[^\d]/g, '')) || 0)
      : undefined;
  }, [originalPrice, currentPrice, product.discount]);

  return (
    <>
      <FloatingEntregoEstrenoButton />

      {/* Barra sticky de precio */}
      <StickyPriceBar
        deviceName={product.name}
        basePrice={currentPrice || 0}
        originalPrice={originalPrice}
        discount={discountAmount}
        selectedStorage={selectedStorage?.capacidad}
        selectedColor={selectedColor?.color}
        hasAddiFinancing={true}
        onBuyClick={handleBuyNow}
        isVisible={true}
      />

      {/* Modal de galería de imágenes */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        currentIndex={galleryIndex}
        productName={product.name}
      />

      <main
        className="w-full bg-white min-h-screen"
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        {/* DESKTOP: Grid principal */}
        <motion.section
          ref={desktopReveal.ref}
          {...desktopReveal.motionProps}
          className="hidden lg:block"
        >
          <div className="max-w-[1280px] mx-auto px-12 py-16">
            <div className="grid grid-cols-12 gap-2 items-start">
              {/* Columna izquierda: Info y acciones */}
              <div className="col-span-7 flex flex-col justify-start gap-2">
                <header className="mb-2">
                  <div className="flex items-start gap-3 mb-2 pr-4">
                    <h1
                      className="text-[2.5rem] leading-[1.08] font-bold text-[#222] flex-1 max-w-[85%]"
                      style={{ letterSpacing: "-1.5px" }}
                    >
                      {product.name}
                    </h1>
                    {/* Botón de favoritos */}
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 relative z-10 mt-1"
                      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <Heart
                        className={`w-6 h-6 transition-all duration-200 ${
                          isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </button>
                  </div>

                  {/* SKU del producto - Mostrar placeholder mientras carga */}
                  {selectedVariant?.sku ? (
                    <div className="text-xs text-[#8A8A8A] mb-3">
                      {selectedVariant.sku}
                    </div>
                  ) : variantsLoading ? (
                    <div className="animate-pulse mb-3">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  ) : null}

                  {/* Calificación del producto */}
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${
                              index < Math.floor(product.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : index < (product.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 fill-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-[#222] font-medium">
                        {product.rating.toFixed(1)}
                      </span>
                      {product.reviewCount && (
                        <span className="text-xs text-[#8A8A8A]">
                          ({product.reviewCount} {product.reviewCount === 1 ? 'reseña' : 'reseñas'})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Línea separadora minimalista */}
                  <div className="w-48 h-px bg-gray-200 mb-4"></div>

                  {/* Selector de color */}
                  <section className="mb-4">
                    <label className="block text-sm text-[#222] font-medium mb-2">
                      Elige tu Color
                    </label>
                    {selectedColor && (
                      <div className="text-xs text-[#8A8A8A] mb-3">
                        {selectedColor.color}
                      </div>
                    )}
                    <div className="flex gap-3 items-center">
                      <ColorSelector
                        colorOptions={colorOptions}
                        selectedColor={selectedColor}
                        handleColorSelection={handleColorSelection}
                        hasStock={hasStock}
                      />
                    </div>
                  </section>

                  {/* Línea separadora minimalista */}
                  <div className="w-48 h-px bg-gray-200 mb-4"></div>

                  {/* Selector de almacenamiento */}
                  <section className="mb-4">
                    <label className="block text-sm text-[#222] font-medium mb-3">
                      Elige tu Almacenamiento
                    </label>
                    <div className="flex gap-3">
                      {storageOptions && storageOptions.length > 0 ? (
                        storageOptions.map((storage) => (
                            <button
                              key={storage.capacidad}
                              className={`rounded-full border px-6 py-2 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none ${
                                selectedStorage?.capacidad === storage.capacidad
                                  ? "border-[#0099FF] bg-[#0099FF] text-white"
                                  : "border-[#0099FF] text-[#0099FF] bg-white hover:bg-[#F2F6FA]"
                              }`}
                              onClick={() => setSelectedStorage(storage)}
                            >
                              {storage.capacidad}
                            </button>
                          ))
                      ) : variantsLoading ? (
                        // Placeholder mientras carga
                        <div className="flex gap-3 animate-pulse">
                          <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                          <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                        </div>
                      ) : product.capacity ? (
                            <button className="rounded-full border border-[#0099FF] text-[#0099FF] px-6 py-2 font-semibold text-sm bg-white focus:bg-[#F2F6FA] focus:outline-none transition-all duration-200 ease-in-out">
                              {product.capacity}
                            </button>
                      ) : null}
                    </div>
                  </section>

                  {/* Línea separadora minimalista */}
                  <div className="w-48 h-px bg-gray-200 mb-4"></div>

                  {/* Selector de memoria RAM */}
                  <section className="mb-4">
                    <label className="block text-sm text-[#222] font-medium mb-3">
                      Elige tu Memoria RAM
                    </label>
                    <div className="flex gap-3">
                      {variantsLoading ? (
                        // Placeholder mientras carga
                        <div className="flex gap-3 animate-pulse">
                          <div className="h-10 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-10 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      ) : (
                        <>
                          {/* Por ahora opciones estáticas, se puede hacer dinámico desde el backend */}
                          <button className="rounded-full border border-[#0099FF] bg-[#0099FF] text-white px-6 py-2 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none">
                            8 GB
                          </button>
                          <button className="rounded-full border border-[#0099FF] text-[#0099FF] bg-white hover:bg-[#F2F6FA] px-6 py-2 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none">
                            12 GB
                          </button>
                        </>
                      )}
                    </div>
                  </section>

                  {/* Línea separadora minimalista */}
                  <div className="w-48 h-px bg-gray-200 mb-4"></div>

                  {/* Opciones de entrega */}
                  <section className="mb-4">
                    <label className="block text-sm text-[#222] font-medium mb-3">
                      Opciones de Entrega
                    </label>
                    <div className="flex flex-col gap-2 max-w-md">
                      {/* Entrega estándar */}
                      <button
                        onClick={() => setDeliveryOption("standard")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                          deliveryOption === "standard"
                            ? "border-[#0099FF] bg-[#F0F8FF]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`flex-shrink-0 ${deliveryOption === "standard" ? "text-[#0099FF]" : "text-gray-400"}`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs font-semibold text-[#222]">
                            Estándar
                          </div>
                          <div className="text-[10px] text-gray-600">
                            1-3 días • Gratis
                          </div>
                        </div>
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          deliveryOption === "standard"
                            ? "border-[#0099FF] bg-[#0099FF]"
                            : "border-gray-300"
                        }`}>
                          {deliveryOption === "standard" && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </button>

                      {/* Entrega express */}
                      <button
                        onClick={() => setDeliveryOption("express")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                          deliveryOption === "express"
                            ? "border-[#0099FF] bg-[#F0F8FF]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`flex-shrink-0 ${deliveryOption === "express" ? "text-[#0099FF]" : "text-gray-400"}`}>
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs font-semibold text-[#222]">
                            Express
                          </div>
                          <div className="text-[10px] text-gray-600">
                            Mismo día • +$20.000
                          </div>
                        </div>
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          deliveryOption === "express"
                            ? "border-[#0099FF] bg-[#0099FF]"
                            : "border-gray-300"
                        }`}>
                          {deliveryOption === "express" && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </button>
                    </div>
                  </section>

                  {/* Línea separadora minimalista */}
                  <div className="w-48 h-px bg-gray-200 mb-4"></div>

                  {/* Estreno y Entrego */}
                  <section className="mb-4">
                    <label className="block text-sm text-[#222] font-medium mb-2">
                      Obtén un descuento inmediato seleccionando Estreno y Entrego
                    </label>
                    <div className="flex gap-3 max-w-md">
                      {/* Opción Sí */}
                      <button
                        onClick={() => setEstrenoYEntrego(true)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          estrenoYEntrego
                            ? "border-[#0099FF] bg-[#F0F8FF]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <div className={`text-sm font-semibold ${estrenoYEntrego ? "text-[#0099FF]" : "text-[#222]"}`}>
                            Sí
                          </div>
                          <div className="text-[10px] text-green-600 font-medium">
                            10% de descuento
                          </div>
                        </div>
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          estrenoYEntrego
                            ? "border-[#0099FF] bg-[#0099FF]"
                            : "border-gray-300"
                        }`}>
                          {estrenoYEntrego && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </button>

                      {/* Opción No */}
                      <button
                        onClick={() => setEstrenoYEntrego(false)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          !estrenoYEntrego
                            ? "border-[#0099FF] bg-[#F0F8FF]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`text-sm font-semibold ${!estrenoYEntrego ? "text-[#0099FF]" : "text-[#222]"}`}>
                          No
                        </div>
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          !estrenoYEntrego
                            ? "border-[#0099FF] bg-[#0099FF]"
                            : "border-gray-300"
                        }`}>
                          {!estrenoYEntrego && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </button>
                    </div>
                  </section>

                  {/* Ofertas */}
                  <section className="mb-6 max-w-xl">
                    <h3 className="text-xl font-bold text-[#222] mb-4">Oferta</h3>
                    
                    {/* Oferta 1: Estreno y Entrego */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-200">
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-16 h-16 relative">
                          <Image
                            src="/images/products_offers/ESTRENO_ENTREGO_2670x2670_v2.webp"
                            alt="Estreno y Entrego"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="inline-block bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1">
                            Beneficio Exclusivo
                          </div>
                          <h4 className="font-bold text-sm text-[#222] mb-1">
                            Selecciona Estreno y Entrego
                          </h4>
                          <p className="text-xs text-[#666] mb-1">
                            Y obtén $300.000 de Dto. Inmediato en el carrito
                          </p>
                          <button className="text-xs font-semibold text-[#0099FF] hover:underline">
                            Inscríbete en la lista de espera del App
                          </button>
                          <button className="block text-[10px] text-[#666] underline mt-0.5 hover:text-[#222]">
                            Aplican Términos y condiciones
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Oferta 2: Galaxy Buds3 FE */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-200">
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-16 h-16 relative">
                          <Image
                            src="/images/products_offers/GALAXY_BUDS3_FE_2670x2670.webp"
                            alt="Galaxy Buds3 FE"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="inline-block bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1">
                            Beneficio de Lanzamiento
                          </div>
                          <h4 className="font-bold text-sm text-[#222] mb-1">
                            Por la compra de tu nuevo Galaxy S25 FE
                          </h4>
                          <p className="text-xs text-[#666] mb-1">
                            Lleva unos Galaxy Buds3 FE sin pagar más
                          </p>
                          <button className="text-xs font-semibold text-[#0099FF] hover:underline">
                            Inscríbete en la lista de espera del App
                          </button>
                          <button className="block text-[10px] text-[#666] underline mt-0.5 hover:text-[#222]">
                            Aplican Términos y condiciones
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Oferta 3: Puntos Rewards */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-16 h-16 relative">
                          <Image
                            src="/images/products_offers/COMPRA_REWARDS_MULTIPLICA_X10_2670X2670.webp"
                            alt="Puntos Rewards"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="inline-block bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1">
                            Beneficio exclusivo Shop App
                          </div>
                          <h4 className="font-bold text-sm text-[#222] mb-1">
                            ¡Usa tus Puntos Rewards como parte de pago!
                          </h4>
                          <p className="text-xs text-[#666] mb-1">
                            Ahora los multiplicamos X10: Redime 25.000 puntos y recibe $250.000 Dto. Úsalos todos y ahorra.
                          </p>
                          <button className="text-xs font-semibold text-[#0099FF] hover:underline">
                            Inscríbete en la lista de espera del App
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Resumen de Compra y Financiación */}
                  <section className="mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-200 max-w-xl">
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-[#222] mb-1">
                        {product.name}
                      </h2>
                      <div className="text-sm text-[#666]">
                        {selectedColor?.color || 'Negro'} | {selectedStorage?.capacidad || '256 GB'} | {'8GB'}
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-3 mb-3"></div>

                    {/* Precio y financiación */}
                    <div className="mb-4">
                      <div className="text-center mb-3">
                        <h3 className="text-2xl font-bold text-[#222] mb-1">
                          Desde ${Math.round((currentPrice || 3799900) / 12).toLocaleString()} al mes en 12
                        </h3>
                        <p className="text-base text-[#222] mb-1">
                          cuotas sin intereses* o ${(currentPrice || 3799900).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-sm text-gray-500 line-through">
                          ${(originalPrice || 4042447).toLocaleString()}
                        </span>
                        <span className="text-base font-bold text-blue-500">
                          Ahorra ${((originalPrice || 4042447) - (currentPrice || 3799900)).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-xs text-[#666] mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Entregas: en 1-3 días laborables</span>
                      </div>

                      <button className="w-full rounded-full bg-[#4A90E2] text-white px-6 py-3 font-bold text-base shadow-lg hover:bg-[#357ABD] transition-all duration-200">
                        Comprar ahora
                      </button>
                    </div>

                    {/* Información de Addi */}
                    <div className="bg-white rounded-xl p-4 border-2 border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg font-bold text-base">
                          addi
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#222]">
                            Paga en cuotas con Addi
                          </p>
                          <p className="text-[10px] text-[#666]">
                            Sin tarjeta de crédito
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* Beneficio 1 */}
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-xs text-[#222]">
                            <span className="font-semibold">Aprobación inmediata</span> en minutos
                          </div>
                        </div>

                        {/* Beneficio 2 */}
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-xs text-[#222]">
                            <span className="font-semibold">Hasta 36 cuotas</span> flexibles
                          </div>
                        </div>

                        {/* Beneficio 3 */}
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-xs text-[#222]">
                            <span className="font-semibold">Solo con tu cédula</span> - Sin complicaciones
                          </div>
                        </div>

                        {/* Beneficio 4 */}
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-xs text-[#222]">
                            <span className="font-semibold">Primera compra</span> con descuento
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 font-semibold text-xs hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
                        Comprar con Addi
                      </button>

                      <p className="text-[10px] text-[#999] text-center mt-2">
                        *Sujeto a aprobación crediticia
                      </p>
                    </div>
                  </section>

                  <p className="text-base text-[#222] font-light mb-6 leading-snug">
                    {product.description || ""}
                  </p>
                </header>
                {/* Precio y acciones */}
                <div className="mb-6">
                  <div className="text-[1.9rem] font-bold text-[#222] leading-tight mb-1">
                    {currentPrice ? `$${currentPrice.toLocaleString()}` : product.price}
                  </div>
                  <div className="text-xs text-[#8A8A8A] mb-4">
                    {selectedVariant && selectedVariant.precioDescto > 0 && selectedVariant.precioDescto < selectedVariant.precioNormal
                      ? `Descuento: $${(selectedVariant.precioNormal - selectedVariant.precioDescto).toLocaleString()}`
                      : product.discount ? `Descuento: ${product.discount}` : ""}
                  </div>
                  <div className="flex flex-row gap-4">
                    <button
                      className="rounded-full bg-[#0099FF] text-white px-7 py-2 font-semibold text-sm shadow hover:bg-[#007ACC] transition-all duration-200 ease-in-out disabled:opacity-60"
                      onClick={handleBuyNow}
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : "Comprar ahora"}
                    </button>
                    <button
                      className="rounded-full border border-[#0099FF] text-[#0099FF] px-7 py-2 font-semibold text-sm bg-white hover:bg-[#F2F6FA] transition-all duration-200 ease-in-out disabled:opacity-60"
                      onClick={handleAddToCart}
                      disabled={loading}
                    >
                      {loading ? "Agregando..." : "Añadir al carrito"}
                    </button>
                  </div>
                </div>
              </div>
              {/* Columna derecha: Imagen y navegación */}
              <div className="col-span-5 flex flex-col items-center justify-start relative mt-[1.5rem]">
                {/* Card de imagen sin sombra */}
                <div
                  className="w-full flex flex-col items-center scale-110"
                  aria-label="Imagen del producto"
                >
                  <DeviceCarousel
                    alt={product.name}
                    imagePreviewUrl={selectedVariant?.imagePreviewUrl}
                    imageDetailsUrls={selectedVariant?.imageDetailsUrls}
                    onImageClick={handleImageClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        {/* MOBILE: Stack vertical */}
        <motion.section
          ref={mobileReveal.ref}
          {...mobileReveal.motionProps}
          className="lg:hidden"
        >
          <div className="px-4 py-8 max-w-md mx-auto">
            <div className="flex flex-col items-center mb-8">
              <DeviceCarousel
                alt={product.name}
                imagePreviewUrl={selectedVariant?.imagePreviewUrl}
                imageDetailsUrls={selectedVariant?.imageDetailsUrls}
                onImageClick={handleImageClick}
              />
            </div>
            <header className="mb-4 text-center">
              <span className="block text-xs text-[#222] font-semibold tracking-widest uppercase mb-1">
                {product.brand || "Marca"}
              </span>
              <h1 className="text-2xl font-bold text-[#222] mb-2">
                {product.name}
              </h1>
              <p className="text-base text-[#222] mb-4 font-light leading-snug">
                {product.description || ""}
              </p>
            </header>
            <div className="text-2xl font-bold text-[#222] mb-1 text-center">
              {currentPrice ? `$${currentPrice.toLocaleString()}` : (typeof product.price === "number"
                ? product.price
                : parseInt((product.price || "0").replace(/[^\d]/g, "")))}
            </div>
            <div className="text-xs text-[#8A8A8A] mb-4 text-center">
              {selectedVariant && selectedVariant.precioDescto > 0 && selectedVariant.precioDescto < selectedVariant.precioNormal
                ? `Descuento: $${(selectedVariant.precioNormal - selectedVariant.precioDescto).toLocaleString()}`
                : product.discount ? `Descuento: ${product.discount}` : ""}
            </div>
            <div className="flex gap-3 mb-6 justify-center">
              <button
                className="rounded-full bg-[#0099FF] text-white px-6 py-2 font-semibold text-base shadow hover:bg-[#007ACC] transition-all duration-200 ease-in-out disabled:opacity-60"
                onClick={handleBuyNow}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Comprar ahora"}
              </button>
              <button
                className="rounded-full border border-[#0099FF] text-[#0099FF] px-6 py-2 font-semibold text-base bg-white hover:bg-[#F2F6FA] transition-all duration-200 ease-in-out disabled:opacity-60"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? "Agregando..." : "Añadir al carrito"}
              </button>
            </div>
            {/* Capacidad */}
            <section className="mb-6">
              <label className="block text-sm text-[#222] font-medium mb-2">
                Elige tu capacidad
              </label>
              <div className="flex gap-3 justify-center">
                {/* Renderizar capacidades filtradas por color seleccionado */}
                {storageOptions && storageOptions.length > 0
                  ? storageOptions.map((storage) => (
                      <button
                        key={storage.capacidad}
                        className={`rounded-full border px-6 py-2 font-semibold text-base transition-all duration-200 ease-in-out focus:outline-none ${
                          selectedStorage?.capacidad === storage.capacidad
                            ? "border-[#0099FF] bg-[#0099FF] text-white"
                            : "border-[#0099FF] text-[#0099FF] bg-white hover:bg-[#F2F6FA]"
                        }`}
                        onClick={() => setSelectedStorage(storage)}
                      >
                        {storage.capacidad}
                      </button>
                    ))
                  : product.capacity && (
                      <button className="rounded-full border border-[#0099FF] text-[#0099FF] px-6 py-2 font-semibold text-base bg-white focus:bg-[#F2F6FA] focus:outline-none transition-all duration-200 ease-in-out">
                        {product.capacity}
                      </button>
                    )}
              </div>
            </section>
            {/* Selector de color */}
            <section className="mb-8">
              <label className="block text-sm text-[#222] font-medium mb-2">
                Color
              </label>
              <div className="flex gap-5 items-center justify-center">
                <ColorSelector
                  colorOptions={colorOptions}
                  selectedColor={selectedColor}
                  handleColorSelection={handleColorSelection}
                  hasStock={hasStock}
                />
              </div>
              {selectedColor && (
                <div className="text-xs text-[#222] mt-2 font-medium text-center">
                  {selectedColor.color}
                </div>
              )}
            </section>
          </div>
        </motion.section>
        {/* Beneficios Mobile (mantener oculto si no se usa) */}
        <motion.section
          ref={beneficiosReveal.ref}
          {...beneficiosReveal.motionProps}
          className="bg-gray-100 py-12 lg:hidden"
        >
          {/* <BenefitsSectionMobile /> */}
        </motion.section>
        {/* Espaciado adicional antes de especificaciones técnicas */}
        <div className="py-16 lg:py-20"></div>
        {/* Especificaciones técnicas dinámicas */}
        {/* <Specifications product={product} /> */}
      </main>
    </>
  );
};

export default DetailsProductSection;
