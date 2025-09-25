"use client";

import { use } from "react";
import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StaticImageData } from "next/image";
import smartphonesImg from "@/img/dispositivosmoviles/cel1.png";
import {
  ProductCardProps,
  ProductColor,
} from "@/app/productos/components/ProductCard";

import ViewProductAppliance from "../../electrodomesticos/ViewProductAppliance";

// Imports adicionales del DetailsProduct
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Importar iconos para beneficios
import settingIcon from "@/img/iconos/Setting_line.png";
import addiIcon from "@/img/iconos/addi_logo.png";
import packageIcon from "@/img/iconos/package_car.png";
import percentIcon from "@/img/iconos/Percent_light.png";

// Importar imagen del dispositivo por defecto
import deviceImage from "@/img/dispositivosmoviles/cel1.png";

// Importar imagen de Entrego y Estreno
import entregoEstrenoLogo from "@/img/entrego-estreno/entrego-estreno-logo.png";
import gifEntregoEstreno from "@/img/gif/gif-entrego-estreno.gif";

// Componente DetailsProduct integrado
function DetailsProductSection() {
  const router = useRouter();

  // Estados para las selecciones del usuario
  const [selectedDevice, setSelectedDevice] = useState("Galaxy S25");
  const [selectedStorage, setSelectedStorage] = useState("256 GB");
  const [selectedColor, setSelectedColor] = useState("Azul Naval");

  // Estado para el hover del botón flotante Entrego y Estreno
  const [isFloatingHovered, setIsFloatingHovered] = useState(false);

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
                {/* Carrusel de dispositivos */}
                <div className="relative bg-gray-100 rounded-2xl p-8 w-full max-w-2xl">
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
    "aire acondicionado","hornos","microondas"
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
      <DetailsProductSection />
      {/* Luego mostrar el ViewProduct original */}
      {isRefrigerador ? (
        <ViewProductAppliance product={convertedProduct} />
      ) : (
        <ViewProduct product={convertedProduct} />
      )}
    </>
  );
}

import { useEffect } from "react";
import { useProductContext } from "@/features/products/ProductContext";

function SetApplianceFlag({ isRefrigerador }: { isRefrigerador: boolean }) {
  const { setIsAppliance } = useProductContext();

  useEffect(() => {
    console.log("Setting isAppliance to:", isRefrigerador);
    setIsAppliance(isRefrigerador);
  }, [isRefrigerador, setIsAppliance]);

  return null;
}
