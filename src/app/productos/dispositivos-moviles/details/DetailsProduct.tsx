"use client";
/**
 * 📱 DETAILS PRODUCT COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente de especificaciones del producto que replica EXACTAMENTE las imágenes de referencia:
 * - Vista Desktop: Dispositivo a la izquierda, especificaciones en cards a la derecha
 * - Vista Mobile: Layout vertical responsivo con todas las secciones
 * - Sección Dispositivo con selección de modelos
 * - Sección Almacenamiento con opciones
 * - Sección Color con selectores visuales
 * - Sección Beneficios Imagiq con iconos
 * - Código limpio, escalable y documentado
 * - Diseño idéntico a las capturas proporcionadas
 */

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Importar iconos para beneficios
import settingIcon from "@/img/iconos/Setting_line.png";
import addiIcon from "@/img/iconos/addi_logo.png";
import packageIcon from "@/img/iconos/package_car.png";
import percentIcon from "@/img/iconos/Percent_light.png";

// Importar imagen del dispositivo por defecto
import deviceImage from "@/img/dispositivosmoviles/cel1.png";

// Importar imagen de Entrego y Estreno
import entregoEstrenoLogo from "@/img/entrego-estreno/entrego-estreno-logo.png";

/**
 * Componente principal de especificaciones del producto
 * Replica exactamente el diseño de las imágenes de referencia
 */
const DetailsProduct: React.FC = () => {
  const router = useRouter();

  // Estados para las selecciones del usuario
  const [selectedDevice, setSelectedDevice] = useState("Galaxy S25");
  const [selectedStorage, setSelectedStorage] = useState("256 GB");
  const [selectedColor, setSelectedColor] = useState("Azul Naval");

  // Datos de dispositivos disponibles
  const devices = [
    {
      name: "Galaxy S25",
      monthlyPrice: "Desde $ 128.329 al mes o",
      totalPrice: "$ 4.299.900",
      id: "galaxy-s25",
    },
    {
      name: "Galaxy S25+",
      monthlyPrice: "Desde $ 158.329 al mes o",
      totalPrice: "$ 4.999.900",
      id: "galaxy-s25-plus",
    },
    {
      name: "Galaxy S25 Ultra",
      monthlyPrice: "Desde $ 189.329 al mes o",
      totalPrice: "$ 5.999.900",
      id: "galaxy-s25-ultra",
    },
  ];

  // Datos de almacenamiento disponible
  const storageOptions = [
    {
      size: "256 GB",
      price: "Desde $ 189.329 al mes o $ 4.299.900",
    },
    {
      size: "512 GB",
      price: "Desde $ 211.329 al mes o $ 4.999.900",
    },
  ];

  // Colores disponibles
  const colorOptions = [
    { name: "Azul Naval", color: "bg-blue-900", hex: "#1e3a8a" },
    { name: "Azul Hielo", color: "bg-blue-200", hex: "#bfdbfe" },
    { name: "Plateado", color: "bg-gray-400", hex: "#9ca3af" },
    { name: "Menta", color: "bg-green-300", hex: "#86efac" },
  ];

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

  return (
    <div className="w-full bg-white" style={{ fontFamily: "SamsungSharpSans" }}>
      {/* Vista Desktop */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 gap-16 items-start">
            {/* Columna Izquierda - Dispositivo */}
            <div className="flex flex-col items-center space-y-8">
              {/* Carrusel de dispositivos */}
              <div className="relative bg-gray-100 rounded-2xl p-8 w-full max-w-md">
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
                    width={600}
                    height={960}
                    className="object-contain"
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

              {/* Botón Entrego y Estreno */}
              <button
                onClick={handleEntregoEstreno}
                className="hover:opacity-80 transition-opacity"
                type="button"
                aria-label="Entrego y Estreno"
              >
                <Image
                  src={entregoEstrenoLogo}
                  alt="Entrego y Estreno"
                  width={200}
                  height={60}
                  className="object-contain"
                />
              </button>
            </div>

            {/* Columna Derecha - Especificaciones */}
            <div className="flex flex-col gap-8">
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
                <div className="flex flex-col gap-3">
                  {devices.map((device) => (
                    <button
                      key={device.id}
                      className={`flex items-center justify-between w-full rounded-xl border px-5 py-4 transition-colors shadow-sm focus:outline-none ${
                        selectedDevice === device.name
                          ? "border-[#17407A] bg-[#F2F6FA]"
                          : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                      }`}
                      onClick={() => setSelectedDevice(device.name)}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                            selectedDevice === device.name
                              ? "border-[#17407A] bg-[#17407A]"
                              : "border-[#BFD7F2] bg-white"
                          }`}
                        >
                          {selectedDevice === device.name && (
                            <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                          )}
                        </span>
                        <div className="flex flex-col items-start">
                          <span
                            className="text-[16px] font-semibold text-[#002142]"
                            style={{ fontFamily: "SamsungSharpSans" }}
                          >
                            {device.name}
                          </span>
                          <span
                            className="text-[17px] font-bold text-[#002142]"
                            style={{ fontFamily: "SamsungSharpSans" }}
                          >
                            {device.totalPrice}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center py-1">
                        <Image
                          src={deviceImage}
                          alt={device.name}
                          width={56}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </button>
                  ))}
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
                  {storageOptions.map((storage) => (
                    <button
                      key={storage.size}
                      className={`flex items-center justify-between w-full rounded-xl border px-5 py-4 transition-colors shadow-sm focus:outline-none ${
                        selectedStorage === storage.size
                          ? "border-[#17407A] bg-[#F2F6FA]"
                          : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                      }`}
                      onClick={() => setSelectedStorage(storage.size)}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                            selectedStorage === storage.size
                              ? "border-[#17407A] bg-[#17407A]"
                              : "border-[#BFD7F2] bg-white"
                          }`}
                        >
                          {selectedStorage === storage.size && (
                            <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                          )}
                        </span>
                        <span
                          className="text-[16px] font-semibold text-[#002142]"
                          style={{ fontFamily: "SamsungSharpSans" }}
                        >
                          {storage.size}
                        </span>
                      </div>
                      <span
                        className="text-[17px] font-bold text-[#002142]"
                        style={{ fontFamily: "SamsungSharpSans" }}
                      >
                        {storage.price}
                      </span>
                    </button>
                  ))}
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
                      key={colorOption.name}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedColor === colorOption.name
                          ? "border-[#17407A] scale-110"
                          : "border-[#BFD7F2]"
                      } ${colorOption.color}`}
                      onClick={() => setSelectedColor(colorOption.name)}
                      aria-label={colorOption.name}
                      title={colorOption.name}
                    >
                      <span className="sr-only">{colorOption.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vista Mobile */}
      <div className="lg:hidden">
        <div className="px-4 py-8 space-y-8">
          {/* Dispositivo en mobile */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative bg-gray-100 rounded-2xl p-6 w-full max-w-sm">
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

            {/* Botón Entrego y Estreno Mobile */}
            <button
              onClick={handleEntregoEstreno}
              className="hover:opacity-80 transition-opacity"
              type="button"
              aria-label="Entrego y Estreno"
            >
              <Image
                src={entregoEstrenoLogo}
                alt="Entrego y Estreno"
                width={180}
                height={54}
                className="object-contain"
              />
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
                {devices.map((device) => (
                  <button
                    key={device.id}
                    className={`flex items-center justify-between w-full rounded-xl border px-4 py-4 transition-colors shadow-sm focus:outline-none ${
                      selectedDevice === device.name
                        ? "border-[#17407A] bg-[#F2F6FA]"
                        : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                    }`}
                    onClick={() => setSelectedDevice(device.name)}
                    type="button"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                          selectedDevice === device.name
                            ? "border-[#17407A] bg-[#17407A]"
                            : "border-[#BFD7F2] bg-white"
                        }`}
                      >
                        {selectedDevice === device.name && (
                          <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                        )}
                      </span>
                      <div className="flex flex-col items-start">
                        <span
                          className="text-[16px] font-semibold text-[#002142]"
                          style={{ fontFamily: "SamsungSharpSans" }}
                        >
                          {device.name}
                        </span>
                        <span
                          className="text-[17px] font-bold text-[#002142]"
                          style={{ fontFamily: "SamsungSharpSans" }}
                        >
                          {device.totalPrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center py-1">
                      <Image
                        src={deviceImage}
                        alt={device.name}
                        width={56}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                  </button>
                ))}
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
                {storageOptions.map((storage) => (
                  <button
                    key={storage.size}
                    className={`flex items-center justify-between w-full rounded-xl border px-4 py-4 transition-colors shadow-sm focus:outline-none ${
                      selectedStorage === storage.size
                        ? "border-[#17407A] bg-[#F2F6FA]"
                        : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
                    }`}
                    onClick={() => setSelectedStorage(storage.size)}
                    type="button"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                          selectedStorage === storage.size
                            ? "border-[#17407A] bg-[#17407A]"
                            : "border-[#BFD7F2] bg-white"
                        }`}
                      >
                        {selectedStorage === storage.size && (
                          <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
                        )}
                      </span>
                      <span
                        className="text-[16px] font-semibold text-[#002142]"
                        style={{ fontFamily: "SamsungSharpSans" }}
                      >
                        {storage.size}
                      </span>
                    </div>
                    <span
                      className="text-[17px] font-bold text-[#002142]"
                      style={{ fontFamily: "SamsungSharpSans" }}
                    >
                      {storage.price}
                    </span>
                  </button>
                ))}
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
                    key={colorOption.name}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedColor === colorOption.name
                        ? "border-[#17407A] scale-110"
                        : "border-[#BFD7F2]"
                    }`}
                    onClick={() => setSelectedColor(colorOption.name)}
                    aria-label={colorOption.name}
                    title={colorOption.name}
                  >
                    <span className="sr-only">{colorOption.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Beneficios Imagiq */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              Beneficios Imagiq
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </div>
  );
};

export default DetailsProduct;
