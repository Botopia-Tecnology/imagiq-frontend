// Sección principal de detalles de producto
// Orquesta los subcomponentes de detalle de producto móvil y desktop
import React from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSelectedColor } from "@/contexts/SelectedColorContext";
import {
  useDeviceVariants,
  DeviceVariant,
  ColorOption,
} from "@/hooks/useDeviceVariants";
import DeviceCarousel from "./DeviceCarousel";
import DeviceSelector from "./DeviceSelector";
import StorageSelector from "./StorageSelector";
import ColorSelector from "./ColorSelector";
import {
  BenefitsSectionDesktop,
  BenefitsSectionMobile,
} from "./BenefitsSection";
import FloatingEntregoEstrenoButton from "./FloatingEntregoEstrenoButton";
import deviceImage from "@/img/dispositivosmoviles/cel1.png";

/**
 * Sección principal de detalles de producto, maneja lógica y orquesta subcomponentes.
 */
const DetailsProductSection: React.FC<{ productId: string }> = ({
  productId,
}) => {
  // Hooks de variantes y color global
  const {
    deviceOptions,
    storageOptions,
    colorOptions,
    selectedDevice,
    selectedStorage,
    selectedColor,
    loading: variantsLoading,
    error: variantsError,
    setSelectedDevice,
    setSelectedStorage,
    setSelectedColor,
  } = useDeviceVariants(productId);
  const {
    selectedColor: globalSelectedColor,
    setSelectedColor: setGlobalSelectedColor,
  } = useSelectedColor();

  // Sincronización de selección de color
  const handleColorSelection = (colorOption: ColorOption) => {
    setSelectedColor(colorOption);
    if (colorOption?.hex) setGlobalSelectedColor(colorOption.hex);
  };

  // Sombra dinámica basada en color
  const getDynamicShadowStyle = () => {
    const shadowColor = selectedColor?.hex || globalSelectedColor || "#17407A";
    const hexToRgba = (hex: string, alpha: number = 0.25) => {
      let c = hex.replace("#", "");
      if (c.length === 3)
        c = c
          .split("")
          .map((x) => x + x)
          .join("");
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    return {
      boxShadow: [
        `0 8px 32px 0 ${hexToRgba(shadowColor, 0.32)}`,
        `0 2px 8px 0 ${hexToRgba(shadowColor, 0.13)}`,
        `0 0 0 8px ${hexToRgba(shadowColor, 0.07)}`,
        "0 1.5px 8px 0 rgba(30,41,59,0.08)",
      ].join(", "),
      transition: "box-shadow 0.7s cubic-bezier(0.4,0,0.2,1)",
      willChange: "box-shadow",
    };
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

  // Precios
  const formatPrice = (price: number) => `$ ${price.toLocaleString("es-CO")}`;
  const getDisplayPrice = (variant: DeviceVariant | null) => {
    if (!variant) return "Precio no disponible";
    const price =
      variant.precioDescto > 0 ? variant.precioDescto : variant.precioNormal;
    return formatPrice(price);
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

  return (
    <>
      <FloatingEntregoEstrenoButton />
      <div
        className="w-full bg-white"
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        {/* Desktop */}
        <motion.div
          ref={desktopReveal.ref}
          {...desktopReveal.motionProps}
          className="hidden lg:block"
        >
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-12 gap-8 items-start">
              <BenefitsSectionDesktop />
              {/* Centro: Carrusel */}
              <div className="col-span-5 flex flex-col items-center space-y-8">
                <div style={getDynamicShadowStyle()}>
                  <DeviceCarousel
                    deviceImage={deviceImage}
                    alt="Samsung Galaxy S25"
                  />
                </div>
                <button
                  className="border border-gray-300 text-gray-700 px-8 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Vista previa
                </button>
              </div>
              {/* Derecha: Selectores */}
              <div className="col-span-5 flex flex-col gap-8">
                {/* Dispositivo */}
                <div>
                  <h3
                    className="text-[22px] font-bold text-[#002142] mb-1"
                    style={{
                      fontFamily: "SamsungSharpSans",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Dispositivo
                  </h3>
                  <p
                    className="text-[15px] text-[#222] mb-4"
                    style={{ fontFamily: "SamsungSharpSans" }}
                  >
                    Selecciona tu dispositivo
                  </p>
                  {variantsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#17407A]"></div>
                    </div>
                  ) : variantsError ? (
                    <div className="text-center text-red-600 py-4">
                      Error al cargar dispositivos: {variantsError}
                    </div>
                  ) : (
                    <DeviceSelector
                      deviceOptions={deviceOptions}
                      selectedDevice={selectedDevice}
                      setSelectedDevice={setSelectedDevice}
                      getDisplayPrice={getDisplayPrice}
                      deviceImage={deviceImage}
                    />
                  )}
                  <div className="mt-2 flex items-center justify-end">
                    <span className="text-xs text-gray-400 mr-2">
                      ¿Necesitas ayuda escogiendo tu modelo?
                    </span>
                    <button
                      className="bg-[#E3E8EF] text-[#17407A] px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ fontFamily: "SamsungSharpSans" }}
                    >
                      Compararlas aquí
                    </button>
                  </div>
                </div>
                {/* Almacenamiento */}
                <div>
                  <h3
                    className="text-[22px] font-bold text-[#002142] mb-1"
                    style={{
                      fontFamily: "SamsungSharpSans",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Almacenamiento
                  </h3>
                  <p
                    className="text-[15px] text-[#222] mb-4"
                    style={{ fontFamily: "SamsungSharpSans" }}
                  >
                    Selecciona el espacio que necesitas
                  </p>
                  <StorageSelector
                    storageOptions={storageOptions}
                    selectedStorage={selectedStorage}
                    setSelectedStorage={setSelectedStorage}
                    getDisplayPrice={getDisplayPrice}
                  />
                </div>
                {/* Color */}
                <div>
                  <h3
                    className="text-[22px] font-bold text-[#002142] mb-1"
                    style={{
                      fontFamily: "SamsungSharpSans",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Color
                  </h3>
                  <p
                    className="text-[15px] text-[#222] mb-4"
                    style={{ fontFamily: "SamsungSharpSans" }}
                  >
                    Selecciona el color de tu dispositivo
                  </p>
                  <ColorSelector
                    colorOptions={colorOptions}
                    selectedColor={selectedColor}
                    handleColorSelection={handleColorSelection}
                    hasStock={hasStock}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Mobile */}
        <motion.div
          ref={mobileReveal.ref}
          {...mobileReveal.motionProps}
          className="lg:hidden"
        >
          <div className="px-4 py-8 space-y-8">
            <div className="flex flex-col items-center space-y-6">
              <div
                className="relative bg-gray-100 rounded-2xl p-6 w-full max-w-sm"
                style={getDynamicShadowStyle()}
              >
                <div className="flex justify-center">
                  <DeviceCarousel
                    deviceImage={deviceImage}
                    alt="Samsung Galaxy S25"
                  />
                </div>
              </div>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium">
                Vista previa
              </button>
            </div>
            <div className="space-y-6">
              {/* Dispositivo */}
              <div>
                <h3
                  className="text-[22px] font-bold text-[#002142] mb-1"
                  style={{
                    fontFamily: "SamsungSharpSans",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Dispositivo
                </h3>
                <p
                  className="text-[15px] text-[#222] mb-4"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Selecciona tu dispositivo
                </p>
                <DeviceSelector
                  deviceOptions={deviceOptions}
                  selectedDevice={selectedDevice}
                  setSelectedDevice={setSelectedDevice}
                  getDisplayPrice={getDisplayPrice}
                  deviceImage={deviceImage}
                />
                <div className="mt-2 flex items-center justify-end">
                  <span className="text-xs text-gray-400 mr-2">
                    ¿Necesitas ayuda escogiendo tu modelo?
                  </span>
                  <button
                    className="bg-[#E3E8EF] text-[#17407A] px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ fontFamily: "SamsungSharpSans" }}
                  >
                    Compararlas aquí
                  </button>
                </div>
              </div>
              {/* Almacenamiento */}
              <div>
                <h3
                  className="text-[22px] font-bold text-[#002142] mb-1"
                  style={{
                    fontFamily: "SamsungSharpSans",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Almacenamiento
                </h3>
                <p
                  className="text-[15px] text-[#222] mb-4"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Selecciona el espacio que necesitas
                </p>
                <StorageSelector
                  storageOptions={storageOptions}
                  selectedStorage={selectedStorage}
                  setSelectedStorage={setSelectedStorage}
                  getDisplayPrice={getDisplayPrice}
                />
              </div>
              {/* Color */}
              <div>
                <h3
                  className="text-[22px] font-bold text-[#002142] mb-1"
                  style={{
                    fontFamily: "SamsungSharpSans",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Color
                </h3>
                <p
                  className="text-[15px] text-[#222] mb-4"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Selecciona el color de tu dispositivo
                </p>
                <ColorSelector
                  colorOptions={colorOptions}
                  selectedColor={selectedColor}
                  handleColorSelection={handleColorSelection}
                  hasStock={hasStock}
                />
              </div>
            </div>
          </div>
        </motion.div>
        {/* Beneficios Mobile */}
        <motion.div
          ref={beneficiosReveal.ref}
          {...beneficiosReveal.motionProps}
          className="bg-gray-100 py-12 lg:hidden"
        >
          <BenefitsSectionMobile />
        </motion.div>
      </div>
    </>
  );
};

export default DetailsProductSection;
