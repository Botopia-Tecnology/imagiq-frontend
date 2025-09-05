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

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import samsungImage from "@/img/dispositivosMoviles/cel1.png";
import { productsMock } from "../components/productsMock";
import addiLogo from "@/img/iconos/addi_logo.png";
import packageCar from "@/img/iconos/package_car.png";
import samsungLogo from "@/img/Samsung_black.png";
import EspecificacionesProduct from "./EspecificacionesProduct";
import ComparationProduct from "./ComparationProduct";
import VideosSection from "./VideosSection";
import { usePathname } from "next/navigation";

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

export default function ViewProduct({ product }: { product: ProductData }) {
  // Si no hay producto, busca el primero del mock para desarrollo
  const safeProduct = product || productsMock[0];
  const [selectedColor] = useState(safeProduct?.colors?.[0]);
  // Estado para especificaciones abiertas
  const [openSpecs, setOpenSpecs] = useState<{ [key: number]: boolean }>({});
  const pathname = usePathname();
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBar(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isProductDetailView = pathname.startsWith("/productos/view/");

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
      className="min-h-screen w-full flex flex-col mt-[-10%] pt-[15%]"
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.35), transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.25), transparent 60%),
          radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.2), transparent 70%),
          linear-gradient(135deg, #082B4D 0%, #0A3A66 100%)
        `,
        fontFamily: "SamsungSharpSans",
      }}
    >
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
      {/* Barra superior solo si está en detalles y ha hecho scroll */}
      {isProductDetailView && showBar && (
        <>
          {/* Oculta el navbar principal en esta vista */}
          <style>{`
      header[data-navbar="true"] { display: none !important; }
    `}</style>
          <div
            className="w-full bg-white shadow-sm h-[56px] flex items-center px-4 fixed top-0 pt-2 left-0 z-40"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            {/* Parte izquierda: imagen frame_311_black + logo Samsung + imagen store_black */}
            <div className="flex items-center gap-2" style={{ minWidth: 110 }}>
              {/* Imagen frame_311_black */}
              <img
                src="/frame_311_black.png"
                alt="Frame"
                width={32}
                height={32}
                className="object-contain"
              />
              {/* Logo Samsung clickable */}
              <button
                className="p-0 m-0 bg-transparent border-none cursor-pointer flex items-center"
                title="Ir al inicio"
                aria-label="Ir al inicio"
                onClick={() => (window.location.href = "/")}
              >
                <Image
                  src={samsungLogo}
                  alt="Samsung Logo"
                  width={110}
                  height={32}
                  style={{ objectFit: "contain" }}
                  priority
                />
              </button>
              {/* Imagen store_black */}
              <img
                src="/store_black.png"
                alt="Store"
                width={32}
                height={32}
                className="object-contain"
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
            {/* Parte derecha: botón añadir al carrito + botón comprar */}
            <div className="flex items-center gap-2" style={{ minWidth: 110 }}>
              {/* Botón añadir al carrito */}
              <button
                className="bg-transparent text-black border border-black rounded-full px-4 py-2 font-semibold text-base shadow hover:bg-black hover:text-white transition-all"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleAddToCart}
              >
                Añadir al carrito
              </button>
              {/* Botón comprar */}
              <button
                className="bg-black text-white rounded-full px-6 py-2 font-semibold text-base shadow hover:bg-gray-900 transition-all"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleBuy}
              >
                Comprar
              </button>
            </div>
          </div>
        </>
      )}
      <div className="h-[56px] w-full" />
      {/* Parte 2: Imagen y especificaciones con scroll y animaciones */}
      <div
        className="relative flex items-center justify-center w-full min-h-[600px] py-16 mt-8"
        style={{
          fontFamily: "SamsungSharpSans",
        }}
      >
        {/* SOLO especificaciones y teléfono juntos, sin duplicar imagen */}
        <EspecificacionesProduct specs={safeProduct.specs} />
      </div>

      {/* Sección de Videos justo debajo de EspecificacionesProduct */}
      <VideosSection />

      {/* Componente de comparación justo debajo de VideosSection */}
      <ComparationProduct />
    </div>
  );
}
