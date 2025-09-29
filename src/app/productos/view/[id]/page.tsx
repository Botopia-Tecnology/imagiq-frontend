"use client";

import {
  ProductCardProps,
  ProductColor,
} from "@/app/productos/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProduct } from "@/features/products/useProducts";
import smartphonesImg from "@/img/dispositivosmoviles/cel1.png";
import { StaticImageData } from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";

import ViewProductAppliance from "../../electrodomesticos/ViewProductAppliance";

// Imports adicionales del DetailsProduct
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Importar iconos para beneficios
import addiIcon from "@/img/iconos/addi_logo.png";
import packageIcon from "@/img/iconos/package_car.png";
import percentIcon from "@/img/iconos/Percent_light.png";
import settingIcon from "@/img/iconos/Setting_line.png";

// Importar imagen del dispositivo por defecto
// Importar contexto para funcionalidad de color dinámico
import { useSelectedColor } from "@/contexts/SelectedColorContext";
import deviceImage from "@/img/dispositivosmoviles/cel1.png";

// Importar imagen de Entrego y Estreno
import entregoEstrenoLogo from "@/img/entrego-estreno/entrego-estreno-logo.png";
import gifEntregoEstreno from "@/img/gif/gif-entrego-estreno.gif";

// Importar hook de variantes de dispositivos
import {
  ColorOption,
  DeviceVariant,
  useDeviceVariants,
} from "@/hooks/useDeviceVariants";

// Componente DetailsProduct integrado
function DetailsProductSection({ productId }: { productId: string }) {
  const router = useRouter();

  // Importar el hook de variantes de dispositivos
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

  // Contexto global para el color seleccionado (sincronización entre componentes)
  const {
    selectedColor: globalSelectedColor,
    setSelectedColor: setGlobalSelectedColor,
  } = useSelectedColor();

  // Hook para generar estilos dinámicos basados en el color seleccionado (opcional para futuras mejoras)
  // const { backgroundStyle } = useDynamicBackgroundColor({
  //   selectedColor: selectedColor?.hex || globalSelectedColor,
  //   intensity: 0.4
  // });

  // Función para manejar la selección de color (sincroniza local y contexto global)
  const handleColorSelection = (colorOption: ColorOption) => {
    setSelectedColor(colorOption);
    // Sincronizar con el contexto global para que otros componentes puedan reaccionar
    if (colorOption?.hex) {
      setGlobalSelectedColor(colorOption.hex);
    }
  };

  // Función para generar sombra dinámica basada en el color seleccionado
  const getDynamicShadowStyle = () => {
    const shadowColor = selectedColor?.hex || globalSelectedColor || "#17407A";

    // Convertir hex a rgba para la sombra con opacidad
    const hexToRgba = (hex: string, alpha: number = 0.25) => {
      let c = hex.replace("#", "");
      if (c.length === 3) {
        c = c
          .split("")
          .map((x) => x + x)
          .join("");
      }
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Sombra multicapa premium: profundidad, halo y color dinámico
    return {
      boxShadow: [
        // Sombra base profunda
        `0 8px 32px 0 ${hexToRgba(shadowColor, 0.32)}`,
        // Sombra secundaria más suave
        `0 2px 8px 0 ${hexToRgba(shadowColor, 0.13)}`,
        // Halo exterior sutil
        `0 0 0 8px ${hexToRgba(shadowColor, 0.07)}`,
        // Sombra neutra para contraste
        "0 1.5px 8px 0 rgba(30,41,59,0.08)",
      ].join(", "),
      transition: "box-shadow 0.7s cubic-bezier(0.4,0,0.2,1)",
      willChange: "box-shadow",
    };
  };

  // Estado para el hover del botón flotante Entrego y Estreno
  const [isFloatingHovered, setIsFloatingHovered] = useState(false);

  // Función para formatear precios
  const formatPrice = (price: number) => `$ ${price.toLocaleString("es-CO")}`;

  // Función para obtener el precio a mostrar
  const getDisplayPrice = (variant: DeviceVariant | null) => {
    if (!variant) return "Precio no disponible";
    const price =
      variant.precioDescto > 0 ? variant.precioDescto : variant.precioNormal;
    return formatPrice(price);
  };

  // Función para verificar si la combinación actual tiene stock
  const hasStock = () => {
    if (!selectedDevice || !selectedStorage || !selectedColor) return true;

    // Buscar la variante que coincida con la selección actual
    const variant = selectedColor.variants.find(
      (v) =>
        v.nombreMarket === selectedDevice.nombreMarket &&
        v.capacidad === selectedStorage.capacidad &&
        v.color.toLowerCase() === selectedColor.color.toLowerCase()
    );

    return variant ? variant.stock > 0 : false;
  };

  // Beneficios de Imagiq
  const benefits = [
    {
      icon: packageIcon,
      title: "Envío gratis a",
      subtitle: "toda Colombia",
    },
    {
      icon: percentIcon,
      title: "0% de interés en",
      subtitle: "tarjetas débito",
    },
    {
      icon: settingIcon,
      title: "Soporte técnico",
      subtitle: "garantizado",
    },
    {
      icon: addiIcon,
      title: "Retira en más de 14",
      subtitle: "ciudades de Colombia",
    },
  ];

  // Función para navegar a Entrego y Estreno
  const handleEntregoEstreno = () => {
    router.push("/productos/components/entrego-estreno");
  };

  // Animación scroll reveal para desktop
  const desktopReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  // Animación scroll reveal para mobile
  const mobileReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  // Animación scroll reveal para beneficios
  const beneficiosReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  return (
    <>
      {/* Botón flotante Entrego y Estreno - esquina inferior izquierda, experiencia mejorada */}
      <button
        type="button"
        aria-label="Entrego y Estreno flotante"
        onClick={handleEntregoEstreno}
        onMouseEnter={() => setIsFloatingHovered(true)}
        onMouseLeave={() => setIsFloatingHovered(false)}
        className="fixed left-4 bottom-6 z-50 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-200 focus:outline-none bg-white shadow-xl transition-all duration-300 ease-in-out group"
        style={{
          boxShadow: "0 4px 24px 0 rgba(30,64,175,0.16)",
          position: "fixed",
          left: "1rem",
          bottom: "1.5rem",
        }}
      >
        {/* Imagen GIF por defecto, cambia a logo en hover con fondo blanco animado, escala y opacidad premium */}
        <span className="absolute inset-0 flex items-center justify-center">
          <Image
            src={gifEntregoEstreno}
            alt="Entrego y Estreno GIF"
            width={56}
            height={56}
            className={`object-contain transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
              isFloatingHovered ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
            priority
          />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
            isFloatingHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        >
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-2xl flex items-center justify-center">
            <Image
              src={entregoEstrenoLogo}
              alt="Entrego y Estreno Logo"
              width={80}
              height={80}
              className="object-contain drop-shadow-2xl transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
              priority
            />
          </span>
        </span>
      </button>

      <div
        className="w-full bg-white"
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        {/* Vista Desktop */}
        <motion.div
          ref={desktopReveal.ref}
          {...desktopReveal.motionProps}
          className="hidden lg:block"
        >
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Columna Izquierda - Beneficios Imagiq */}
              <div className="col-span-2 flex flex-col space-y-6">
                <h2
                  className="text-lg font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Beneficios Imagiq
                </h2>
                <div className="flex flex-col space-y-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: "#002142" }}
                      >
                        {benefit.icon === addiIcon ? (
                          <Image
                            src={benefit.icon}
                            alt={benefit.title}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        ) : (
                          <Image
                            src={benefit.icon}
                            alt={benefit.title}
                            width={24}
                            height={24}
                            className="object-contain filter brightness-0 invert"
                          />
                        )}
                      </div>
                      <h3
                        className="font-semibold text-gray-900 text-xs leading-tight"
                        style={{ fontFamily: "SamsungSharpSans" }}
                      >
                        {benefit.title}
                      </h3>
                      <p
                        className="text-gray-600 text-xs leading-tight"
                        style={{ fontFamily: "SamsungSharpSans" }}
                      >
                        {benefit.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Centro - Dispositivo */}
              <div className="col-span-5 flex flex-col items-center space-y-8">
                {/* Carrusel de dispositivos con sombra dinámica basada en color seleccionado */}
                <div
                  className="relative bg-gray-100 rounded-2xl p-8 w-full max-w-2xl"
                  style={getDynamicShadowStyle()}
                >
                  {/* Flechas de navegación */}
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl z-10"
                    aria-label="Anterior dispositivo"
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl z-10"
                    aria-label="Siguiente dispositivo"
                  >
                    ›
                  </button>

                  {/* Imagen del dispositivo */}
                  <div className="flex justify-center">
                    <Image
                      src={deviceImage}
                      alt="Samsung Galaxy S25"
                      width={1000}
                      height={1600}
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>

                  {/* Puntos indicadores */}
                  <div className="flex justify-center space-x-2 mt-6">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === 0 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Botón Vista previa */}
                <button
                  className="border border-gray-300 text-gray-700 px-8 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Vista previa
                </button>
              </div>

              {/* Columna Derecha - Especificaciones */}
              <div className="col-span-5 flex flex-col gap-8">
                {/* Sección: Dispositivo */}
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
                    <div className="flex flex-col gap-3">
                      {deviceOptions.map((deviceOption) => {
                        // Obtener la primera variante para mostrar información base
                        const baseVariant = deviceOption.variants[0];
                        return (
                          <button
                            key={deviceOption.nombreMarket}
                            className={`flex items-center justify-between w-full rounded-xl border px-5 py-4 transition-colors shadow-sm focus:outline-none ${
                              selectedDevice?.nombreMarket ===
                              deviceOption.nombreMarket
                                ? "border-[#17407A] bg-[#F2F6FA]"
                                : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                            }`}
                            onClick={() => setSelectedDevice(deviceOption)}
                            type="button"
                          >
                            <div className="flex items-center gap-4">
                              <span
                                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                                  selectedDevice?.nombreMarket ===
                                  deviceOption.nombreMarket
                                    ? "border-[#17407A] bg-[#17407A]"
                                    : "border-[#BFD7F2] bg-white"
                                }`}
                              >
                                {selectedDevice?.nombreMarket ===
                                  deviceOption.nombreMarket && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                                )}
                              </span>
                              <div className="flex flex-col items-start">
                                <span
                                  className="text-[16px] font-semibold text-[#002142]"
                                  style={{ fontFamily: "SamsungSharpSans" }}
                                >
                                  {deviceOption.nombreMarket}
                                </span>
                                <span
                                  className="text-[17px] font-bold text-[#002142]"
                                  style={{ fontFamily: "SamsungSharpSans" }}
                                >
                                  {getDisplayPrice(baseVariant)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center py-1">
                              <Image
                                src={deviceImage}
                                alt={deviceOption.nombreMarket}
                                width={56}
                                height={80}
                                className="object-contain"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
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
                {/* Sección: Almacenamiento */}
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
                  <div className="flex flex-col gap-3">
                    {storageOptions.map((storageOption) => {
                      // Obtener la primera variante para mostrar precio
                      const baseVariant = storageOption.variants[0];
                      return (
                        <button
                          key={storageOption.capacidad}
                          className={`flex items-center justify-between w-full rounded-xl border px-5 py-4 transition-colors shadow-sm focus:outline-none ${
                            selectedStorage?.capacidad ===
                            storageOption.capacidad
                              ? "border-[#17407A] bg-[#F2F6FA]"
                              : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                          }`}
                          onClick={() => setSelectedStorage(storageOption)}
                          type="button"
                        >
                          <div className="flex items-center gap-4">
                            <span
                              className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                                selectedStorage?.capacidad ===
                                storageOption.capacidad
                                  ? "border-[#17407A] bg-[#17407A]"
                                  : "border-[#BFD7F2] bg-white"
                              }`}
                            >
                              {selectedStorage?.capacidad ===
                                storageOption.capacidad && (
                                <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                              )}
                            </span>
                            <span
                              className="text-[16px] font-semibold text-[#002142]"
                              style={{ fontFamily: "SamsungSharpSans" }}
                            >
                              {storageOption.capacidad}
                            </span>
                          </div>
                          <span
                            className="text-[17px] font-bold text-[#002142]"
                            style={{ fontFamily: "SamsungSharpSans" }}
                          >
                            {getDisplayPrice(baseVariant)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Sección: Color */}
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
                  <div className="flex gap-6">
                    {colorOptions.map((colorOption) => (
                      <button
                        key={colorOption.color}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedColor?.color === colorOption.color
                            ? "border-[#17407A] scale-110"
                            : "border-[#BFD7F2]"
                        }`}
                        style={{ backgroundColor: colorOption.hex }}
                        onClick={() => handleColorSelection(colorOption)}
                        aria-label={colorOption.color}
                        title={colorOption.color}
                      >
                        <span className="sr-only">{colorOption.color}</span>
                      </button>
                    ))}
                  </div>
                  {/* Mensaje de stock */}
                  {selectedDevice &&
                    selectedStorage &&
                    selectedColor &&
                    !hasStock() && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium text-center">
                          Sin stock
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vista Mobile */}
        <motion.div
          ref={mobileReveal.ref}
          {...mobileReveal.motionProps}
          className="lg:hidden"
        >
          <div className="px-4 py-8 space-y-8">
            {/* Dispositivo en mobile */}
            <div className="flex flex-col items-center space-y-6">
              {/* Card con sombra dinámica basada en color seleccionado */}
              <div
                className="relative bg-gray-100 rounded-2xl p-6 w-full max-w-sm"
                style={getDynamicShadowStyle()}
              >
                <div className="flex justify-center">
                  <Image
                    src={deviceImage}
                    alt="Samsung Galaxy S25"
                    width={270}
                    height={420}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === 0 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium">
                Vista previa
              </button>
            </div>

            {/* Especificaciones en mobile */}
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
                <div className="flex flex-col gap-3">
                  {deviceOptions.map((deviceOption) => {
                    // Obtener la primera variante para mostrar información base
                    const baseVariant = deviceOption.variants[0];
                    return (
                      <button
                        key={deviceOption.nombreMarket}
                        className={`flex items-center justify-between w-full rounded-xl border px-4 py-4 transition-colors shadow-sm focus:outline-none ${
                          selectedDevice?.nombreMarket ===
                          deviceOption.nombreMarket
                            ? "border-[#17407A] bg-[#F2F6FA]"
                            : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                        }`}
                        onClick={() => setSelectedDevice(deviceOption)}
                        type="button"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                              selectedDevice?.nombreMarket ===
                              deviceOption.nombreMarket
                                ? "border-[#17407A] bg-[#17407A]"
                                : "border-[#BFD7F2] bg-white"
                            }`}
                          >
                            {selectedDevice?.nombreMarket ===
                              deviceOption.nombreMarket && (
                              <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                            )}
                          </span>
                          <div className="flex flex-col items-start">
                            <span
                              className="text-[16px] font-semibold text-[#002142]"
                              style={{ fontFamily: "SamsungSharpSans" }}
                            >
                              {deviceOption.nombreMarket}
                            </span>
                            <span
                              className="text-[17px] font-bold text-[#002142]"
                              style={{ fontFamily: "SamsungSharpSans" }}
                            >
                              {getDisplayPrice(baseVariant)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center py-1">
                          <Image
                            src={deviceImage}
                            alt={deviceOption.nombreMarket}
                            width={56}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
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
                <div className="flex flex-col gap-3">
                  {storageOptions.map((storageOption) => {
                    // Obtener la primera variante para mostrar precio
                    const baseVariant = storageOption.variants[0];
                    return (
                      <button
                        key={storageOption.capacidad}
                        className={`flex items-center justify-between w-full rounded-xl border px-4 py-4 transition-colors shadow-sm focus:outline-none ${
                          selectedStorage?.capacidad === storageOption.capacidad
                            ? "border-[#17407A] bg-[#F2F6FA]"
                            : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                        }`}
                        onClick={() => setSelectedStorage(storageOption)}
                        type="button"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                              selectedStorage?.capacidad ===
                              storageOption.capacidad
                                ? "border-[#17407A] bg-[#17407A]"
                                : "border-[#BFD7F2] bg-white"
                            }`}
                          >
                            {selectedStorage?.capacidad ===
                              storageOption.capacidad && (
                              <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                            )}
                          </span>
                          <span
                            className="text-[16px] font-semibold text-[#002142]"
                            style={{ fontFamily: "SamsungSharpSans" }}
                          >
                            {storageOption.capacidad}
                          </span>
                        </div>
                        <span
                          className="text-[17px] font-bold text-[#002142]"
                          style={{ fontFamily: "SamsungSharpSans" }}
                        >
                          {getDisplayPrice(baseVariant)}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                <div className="flex gap-6">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption.color}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedColor?.color === colorOption.color
                          ? "border-[#17407A] scale-110"
                          : "border-[#BFD7F2]"
                      }`}
                      style={{ backgroundColor: colorOption.hex }}
                      onClick={() => handleColorSelection(colorOption)}
                      aria-label={colorOption.color}
                      title={colorOption.color}
                    >
                      <span className="sr-only">{colorOption.color}</span>
                    </button>
                  ))}
                </div>
                {/* Mensaje de stock - Mobile */}
                {selectedDevice &&
                  selectedStorage &&
                  selectedColor &&
                  !hasStock() && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium text-center">
                        Sin stock
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sección Beneficios Imagiq para Mobile */}
        <motion.div
          ref={beneficiosReveal.ref}
          {...beneficiosReveal.motionProps}
          className="bg-gray-100 py-12 lg:hidden"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "SamsungSharpSans" }}
              >
                Beneficios Imagiq
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#002142" }}
                  >
                    {benefit.icon === addiIcon ? (
                      <Image
                        src={benefit.icon}
                        alt={benefit.title}
                        width={32}
                        height={32}
                        className="object-contain "
                      />
                    ) : (
                      <Image
                        src={benefit.icon}
                        alt={benefit.title}
                        width={32}
                        height={32}
                        className="object-contain filter brightness-0 invert"
                      />
                    )}
                  </div>
                  <h3
                    className="font-semibold text-gray-900 text-sm"
                    style={{ fontFamily: "SamsungSharpSans" }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "SamsungSharpSans" }}
                  >
                    {benefit.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// Función para convertir ProductCardProps a ProductData compatible con ViewProduct
function convertProductForView(product: ProductCardProps) {
  // Si la imagen es un string (URL), usar imagen por defecto
  const image =
    typeof product.image === "string" ? smartphonesImg : product.image;

  // Función helper para reemplazar datos faltantes con "None"
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
    image: image as StaticImageData,
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
    description: safeValue(product.description, "None"),
    specs: [
      { label: "Marca", value: safeValue(product.brand, "None") },
      { label: "Modelo", value: safeValue(product.model, "None") },
      { label: "Categoría", value: safeValue(product.category, "None") },
      { label: "Subcategoría", value: safeValue(product.subcategory, "None") },
      { label: "Capacidad", value: safeValue(product.capacity, "None") },
      { label: "Stock", value: safeValue(product.stock, "None") },
      { label: "SKU", value: safeValue(product.sku, "None") },
    ],
  };
}

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default function ProductViewPage({ params }) {
  const resolvedParams = use(params) as { id: string };
  const { id } = resolvedParams;

  // Usar el hook de productos para obtener el producto específico
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return notFound();
  }

  if (!product) {
    // Solo mostrar "no encontrado" si realmente no hay producto después de cargar
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

  // Convertir el producto al formato esperado por ViewProduct
  const convertedProduct = convertProductForView(product);
  const categoriasAppliance = [
    "neveras",
    "nevecon",
    "hornos microondas",
    "lavavajillas",
    "lavadora",
    "secadora",
    "aspiradoras",
    "aire acondicionado",
    "hornos",
    "microondas",
  ];
  const subcategoria = convertedProduct.specs
    .find((spec) => spec.label === "Subcategoría")
    ?.value?.toLowerCase();
  const isRefrigerador = subcategoria
    ? categoriasAppliance.some((cat) => subcategoria.includes(cat))
    : false;

  return (
    <>
      <SetApplianceFlag isRefrigerador={!!isRefrigerador} />
      {/* Mostrar primero el DetailsProduct hasta beneficios imagiq */}
      <DetailsProductSection productId={id} />
      {/* Luego mostrar el ViewProduct original */}
      {isRefrigerador ? (
        <ViewProductAppliance product={convertedProduct} />
      ) : (
        <ViewProduct product={convertedProduct} />
      )}
    </>
  );
}

import { useProductContext } from "@/features/products/ProductContext";
import { useEffect } from "react";

function SetApplianceFlag({ isRefrigerador }: { isRefrigerador: boolean }) {
  const { setIsAppliance } = useProductContext();

  useEffect(() => {
    console.log("Setting isAppliance to:", isRefrigerador);
    setIsAppliance(isRefrigerador);
  }, [isRefrigerador, setIsAppliance]);

  return null;
}
