"use client";
/**
 * 🛒 VIEW PRODUCT COMPONENT - IMAGIQ ECOMMERCE
 *
 * Vista detallada de producto con:
 * - Imagen principal
 * - Nombre, precio, colores, descripción
 * - Botones de acción (Añadir al carrito, Favorito, Volver)
 * - Layout responsivo y escalable
 * - Código limpio y documentado
 * - Datos quemados (mock) para desarrollo
 */

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import samsungImage from "@/img/dispositivosMoviles/cel1.png";
import { productsMock } from "./productsMock";
import addiLogo from "@/img/iconos/addi_logo.png";
import packageCar from "@/img/iconos/package_car.png";
import samsungLogo from "@/img/Samsung_black.png";

// Tipos para producto
interface ProductColor {
  name: string;
  hex: string;
}
interface ProductData {
  id: string;
  name: string;
  image: StaticImageData;
  price: string;
  originalPrice?: string;
  discount?: string;
  colors: ProductColor[];
  description?: string;
  specs?: { label: string; value: string }[];
}

// ...existing code...
export default function ViewProduct({ product }: { product: ProductData }) {
  // Si no hay producto, busca el primero del mock para desarrollo
  const safeProduct = product || productsMock[0];
  const [selectedColor] = useState(safeProduct?.colors?.[0]);
  // Estado para especificaciones abiertas
  const [openSpecs, setOpenSpecs] = useState<{ [key: number]: boolean }>({});

  // Especificaciones para mostrar
  const specsList: { title: string; desc: string }[] = [
    {
      title: "Procesador",
      desc: "Velocidad de la CPU: 4.47GHz, 3.5GHz\nTipo CPU: Octa-Core",
    },
    {
      title: "Pantalla",
      desc: "Dynamic AMOLED 2X\n120Hz, HDR10+\nResolución: 3200x1440",
    },
    {
      title: "Compatible con S-pen",
      desc: "Sí, soporta S-pen con baja latencia",
    },
    {
      title: "Cámara",
      desc: "Triple cámara: 50MP + 12MP + 10MP\nFrontal: 12MP",
    },
    {
      title: "Almacenamiento memoria",
      desc: "128GB / 256GB / 512GB\nRAM: 8GB / 12GB",
    },
    {
      title: "Conectividad",
      desc: "5G, WiFi 6E, Bluetooth 5.3, NFC",
    },
    {
      title: "OS",
      desc: "Android 13, One UI 5.1",
    },
  ];

  if (!safeProduct || !safeProduct.colors || safeProduct.colors.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#17407A]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Producto no encontrado
          </h2>
          <p className="text-white/80">
            No se pudo cargar la información del producto.
          </p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleAddToCart = () => {
    alert(`Producto añadido: ${safeProduct.name} (${selectedColor.name})`);
  };
  const handleBuy = () => {
    alert("Compra iniciada");
  };
  // Handler para abrir/cerrar especificación
  const handleToggleSpec = (idx: number) => {
    setOpenSpecs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col mt-[-15%] pt-[15%]"
      style={{
        background:
          "radial-gradient(circle at 40% 40%, #35508A 0%, #274A7A 60%, #19345A 100%)",
        fontFamily: "SamsungSharpSans",
      }}
    >
      {/* Barra superior ocupando todo el ancho */}
      <header
        className="w-full bg-white shadow-sm h-[56px] flex items-center px-8"
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        {/* Logo a la izquierda */}
        <div className="flex items-center" style={{ minWidth: 110 }}>
          <Image
            src={samsungLogo}
            alt="Samsung Logo"
            width={110}
            height={32}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        {/* Nombre centrado */}
        <div className="flex-1 flex justify-center">
          <span
            className="font-bold text-base md:text-lg text-center"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            {safeProduct.name}
          </span>
        </div>
        {/* Botón a la derecha */}
        <div className="flex items-center" style={{ minWidth: 110 }}>
          <button
            className="bg-black text-white rounded-full px-6 py-2 font-semibold text-base shadow hover:bg-gray-900 transition-all"
            style={{ fontFamily: "SamsungSharpSans" }}
            onClick={handleBuy}
          >
            Comprar
          </button>
        </div>
      </header>
      <div className="h-[56px] w-full" />
      {/* Hero section */}
      <section className="flex flex-1 items-center justify-center px-4 py-8 md:py-0">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-0">
          {/* Columna izquierda: info y acciones */}
          <div
            className="flex-1 flex flex-col items-start justify-center gap-6"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            {/* Nombre producto dinámico */}
            <h1
              className="text-white text-3xl md:text-5xl font-bold mb-2 cursor-pointer hover:text-blue-200 transition-all"
              style={{ fontFamily: "SamsungSharpSans", letterSpacing: "-1px" }}
            >
              {safeProduct.name}
            </h1>
            {/* Logos y badges debajo del nombre */}
            <div className="flex flex-col gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center border border-white bg-white/10"
                  style={{
                    minWidth: 80,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                  }}
                >
                  <Image
                    src={addiLogo}
                    alt="Addi Logo"
                    width={58}
                    height={58}
                  />
                </div>
                <span
                  className="text-white text-lg"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Paga hasta en 24 cuotas
                  <br />
                  con Addi
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center border border-white bg-white/10"
                  style={{
                    minWidth: 80,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                  }}
                >
                  <Image src={packageCar} alt="Envío" width={58} height={58} />
                </div>
                <span
                  className="text-white text-lg"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Envío gratis a todo
                  <br />
                  Colombia. *Aplican TYC*
                </span>
              </div>
            </div>
            {/* Botones de acción */}
            <div className="flex gap-4 mt-4">
              <button
                className="bg-black text-white px-8 py-3 rounded-full font-bold text-lg shadow hover:bg-gray-900 transition-all border border-black"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleBuy}
              >
                ¡Compra aquí!
              </button>
              <button
                className="bg-transparent text-white px-8 py-3 rounded-full font-bold text-lg shadow border border-white hover:bg-white/10 transition-all"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleAddToCart}
              >
                Añadir al carrito
              </button>
            </div>
          </div>
          {/* Columna derecha: imagen producto dinámica */}
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={safeProduct.image}
              alt={safeProduct.name}
              width={420}
              height={420}
              className="object-contain drop-shadow-2xl"
              priority
              style={{ background: "none" }}
            />
          </div>
        </div>
      </section>
      {/* Parte 2: Imagen y especificaciones con scroll y animaciones */}
      <div
        className="relative flex items-center justify-center w-full min-h-[600px] py-16 mt-8"
        style={{
          fontFamily: "SamsungSharpSans",
        }}
      >
        {/* Imagen y slider */}
        <div className="flex flex-col items-center justify-center w-[440px]">
          <div className="relative flex items-center justify-center h-[420px] w-[340px] bg-transparent">
            <Image
              src={samsungImage}
              alt="Samsung S"
              width={340}
              height={420}
              className="object-contain"
              style={{ background: "none" }}
            />
            {/* Flechas laterales */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-4xl opacity-80 cursor-pointer select-none hover:text-blue-200 transition-all">
              &#8249;
            </span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-4xl opacity-80 cursor-pointer select-none hover:text-blue-200 transition-all">
              &#8250;
            </span>
          </div>
          {/* Slider dots y preview */}
          <div className="flex items-center gap-3 mt-8">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-white bg-white/60"
              />
            ))}
          </div>
          <button className="mt-6 px-7 py-2 border border-white rounded-full text-white hover:bg-white/30 transition-all text-base font-medium">
            Vista previa
          </button>
        </div>
        {/* Especificaciones con scroll y línea vertical */}
        <div className="relative flex flex-col items-center justify-center w-[480px] h-[420px] ml-12">
          {/* Línea vertical y puntos extremos */}
          <div className="absolute left-0 top-0 h-full flex flex-col items-center justify-between">
            <span
              className="w-4 h-4 rounded-full"
              style={{ marginBottom: "-8px", background: "#14213D" }}
            ></span>
            <div
              className="h-full w-[2.5px] rounded-full"
              style={{
                background: "#14213D", // azul mucho más oscuro
                boxShadow: "0 0 8px 0 #14213D inset",
              }}
            />
            <span
              className="w-4 h-4 rounded-full"
              style={{ marginTop: "-8px", background: "#14213D" }}
            ></span>
          </div>
          {/* Scrollable specs */}
          <div
            className="relative w-full h-full overflow-y-auto pl-12 pr-4 py-2 hide-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .hide-scrollbar {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .spec-content {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.3s;
              }
              .spec-content.open {
                max-height: 300px;
                opacity: 1;
                transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.3s;
              }
            `}</style>
            <h2
              className="text-2xl font-bold text-white mb-8 tracking-wide"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              Especificaciones
            </h2>
            <ul className="flex flex-col gap-8">
              {/* Especificaciones con toggle y animación */}
              {specsList.map(
                (spec: { title: string; desc: string }, idx: number) => (
                  <li
                    key={spec.title}
                    className="text-white font-bold text-xl select-none"
                  >
                    <button
                      className={`w-full text-left font-bold text-xl py-2 px-2 rounded transition-all ${
                        openSpecs[idx]
                          ? "bg-white/10 text-blue-200"
                          : "hover:bg-white/10 hover:text-blue-200"
                      }`}
                      style={{ fontFamily: "SamsungSharpSans" }}
                      onClick={() => handleToggleSpec(idx)}
                    >
                      {spec.title}
                    </button>
                    <div
                      className={`spec-content${openSpecs[idx] ? " open" : ""}`}
                    >
                      <div
                        className="text-base text-white mt-2 whitespace-pre-line font-normal bg-white/5 rounded px-4 py-2 border border-white/20"
                        style={{
                          fontFamily: "SamsungSharpSans",
                          display: openSpecs[idx] ? "block" : "none",
                        }}
                      >
                        {spec.desc}
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
            {/* Scroll indicator dots vertical ELIMINADOS */}
          </div>
        </div>
      </div>
    </div>
  );
}
