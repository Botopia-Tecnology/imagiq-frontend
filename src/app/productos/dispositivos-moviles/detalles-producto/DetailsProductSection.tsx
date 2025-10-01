// Sección principal de detalles de producto
// Ahora recibe el producto real como prop y lo pasa a Specifications y subcomponentes.
import React from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSelectedColor } from "@/contexts/SelectedColorContext";
import { useDeviceVariants, ColorOption } from "@/hooks/useDeviceVariants";
import { useDynamicBackgroundColor } from "@/hooks/useDynamicBackgroundColor";
import DeviceCarousel from "./DeviceCarousel";
import ColorSelector from "./ColorSelector";
import FloatingEntregoEstrenoButton from "./FloatingEntregoEstrenoButton";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import fallbackImage from "@/img/dispositivosmoviles/cel1.png";

/**
 * Cambios visuales realizados:
 * - Reorganización de la estructura principal en dos columnas (desktop) usando grid y flex para alinear exactamente como la imagen.
 * - Ajuste de tipografías, pesos, tamaños y colores para coincidir con el diseño de referencia.
 * - Botones estilizados y alineados horizontalmente, con transiciones suaves.
 * - Secciones de "capacidad" y "color" alineadas y con espaciado consistente.
 * - Uso de semántica HTML adecuada (section, header, main, etc.).
 * - Layout responsivo: grid en desktop, stack en mobile, sin romper lógica ni props.
 * - Comentarios explicativos en cada bloque visual relevante.
 */
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
    setSelectedColor,
    setSelectedStorage,
  } = useDeviceVariants(product.id);
  const {
    selectedColor: selectedColorHex,
    setSelectedColor: setGlobalSelectedColor,
  } = useSelectedColor();
  const { addProduct } = useCartContext();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Sincronización de selección de color
  const handleColorSelection = (colorOption: ColorOption) => {
    setSelectedColor(colorOption);
    if (colorOption?.hex) setGlobalSelectedColor(colorOption.hex);
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

  // Sombra dinámica
  const { color: dynamicShadowColor } = useDynamicBackgroundColor({
    selectedColor: selectedColorHex,
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

  return (
    <>
      <FloatingEntregoEstrenoButton />
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
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Columna izquierda: Info y acciones */}
              <div className="col-span-7 flex flex-col justify-center gap-2">
                <header className="mb-2">
                  <span className="block text-sm text-[#222] font-semibold tracking-widest uppercase mb-1">
                    {product.brand || "Marca"}
                  </span>
                  <h1
                    className="text-[2.8rem] leading-[1.08] font-bold text-[#222] mb-2"
                    style={{ letterSpacing: "-1.5px" }}
                  >
                    {product.name}
                  </h1>
                  <p className="text-lg text-[#222] font-light mb-6 leading-snug">
                    {product.description || ""}
                  </p>
                </header>
                {/* Precio y acciones */}
                <div className="mb-7">
                  <div className="text-[2.1rem] font-bold text-[#222] leading-tight mb-1">
                    {currentPrice ? `$${currentPrice.toLocaleString()}` : product.price}
                  </div>
                  <div className="text-xs text-[#8A8A8A] mb-4">
                    {selectedVariant && selectedVariant.precioDescto > 0 && selectedVariant.precioDescto < selectedVariant.precioNormal
                      ? `Descuento: $${(selectedVariant.precioNormal - selectedVariant.precioDescto).toLocaleString()}`
                      : product.discount ? `Descuento: ${product.discount}` : ""}
                  </div>
                  <div className="flex flex-row gap-4">
                    <button
                      className="rounded-full bg-[#0099FF] text-white px-8 py-2 font-semibold text-base shadow hover:bg-[#007ACC] transition-all duration-200 ease-in-out disabled:opacity-60"
                      onClick={handleBuyNow}
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : "Comprar ahora"}
                    </button>
                    <button
                      className="rounded-full border border-[#0099FF] text-[#0099FF] px-8 py-2 font-semibold text-base bg-white hover:bg-[#F2F6FA] transition-all duration-200 ease-in-out disabled:opacity-60"
                      onClick={handleAddToCart}
                      disabled={loading}
                    >
                      {loading ? "Agregando..." : "Añadir al carrito"}
                    </button>
                  </div>
                </div>
                {/* Capacidad */}
                <section className="mb-7">
                  <label className="block text-base text-[#222] font-medium mb-2">
                    Elige tu capacidad
                  </label>
                  <div className="flex gap-3">
                    {/* Renderizar capacidades filtradas por color seleccionado */}
                    {storageOptions && storageOptions.length > 0
                      ? storageOptions.map((storage) => (
                          <button
                            key={storage.capacidad}
                            className={`rounded-full border px-7 py-2 font-semibold text-base transition-all duration-200 ease-in-out focus:outline-none ${
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
                          <button className="rounded-full border border-[#0099FF] text-[#0099FF] px-7 py-2 font-semibold text-base bg-white focus:bg-[#F2F6FA] focus:outline-none transition-all duration-200 ease-in-out">
                            {product.capacity}
                          </button>
                        )}
                  </div>
                </section>
                {/* Selector de color */}
                <section className="mb-2">
                  <label className="block text-base text-[#222] font-medium mb-2">
                    Color
                  </label>
                  <div className="flex gap-5 items-center">
                    <ColorSelector
                      colorOptions={colorOptions}
                      selectedColor={selectedColor}
                      handleColorSelection={handleColorSelection}
                      hasStock={hasStock}
                    />
                  </div>
                  {selectedColor && (
                    <div className="text-xs text-[#222] mt-2 font-medium">
                      {selectedColor.color}
                    </div>
                  )}
                </section>
              </div>
              {/* Columna derecha: Imagen y navegación */}
              <div className="col-span-5 flex flex-col items-center justify-center relative">
                {/* Card de imagen con sombra dinámica según color seleccionado */}
                <div
                  className="w-full flex flex-col items-center rounded-3xl bg-white transition-all duration-300 ease-in-out shadow-lg"
                  style={{
                    // Sombra dinámica más oscura (alpha 40% = 66 en hex)
                    boxShadow: `0px 8px 32px 0px ${dynamicShadowColor}66`,
                    transition: "box-shadow 0.3s ease-in-out",
                  }}
                  aria-label="Imagen del producto con sombra dinámica"
                >
                  <DeviceCarousel
                    deviceImage={
                      typeof product.image === "string"
                        ? fallbackImage
                        : product.image
                    }
                    alt={product.name}
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
                deviceImage={
                  typeof product.image === "string"
                    ? fallbackImage
                    : product.image
                }
                alt={product.name}
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
        {/* Especificaciones técnicas dinámicas */}
        {/* <Specifications product={product} /> */}
      </main>
    </>
  );
};

export default DetailsProductSection;
