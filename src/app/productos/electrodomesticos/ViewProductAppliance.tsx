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
import { cn } from "@/lib/utils";
import addiLogo from "@/img/iconos/addi_negro.png";
import setingLogo from "@/img/iconos/Setting_line_negro.png";
import packageCar from "@/img/iconos/package_car_negro.png";
import samsungLogo from "@/img/Samsung_black.png";
import EspecificacionesProduct from "./EspecificacionesProduct";
import medidas from "../../../img/electrodomesticos/medidas.png";
import VideosSection from "./VideosSection";
import { usePathname } from "next/navigation";
import ARExperienceHandler from "./components/ARExperienceHandler";
import SizeProduct from "./components/SizeProduct";
import ExploreProduct from "./ExploreProduct";
import smartphonesImg from "@/img/categorias/Smartphones.png";
import nevera from "@/img/electrodomesticos/nevera.png";
import lavadora from "@/img/electrodomesticos/lavadora.png";
import aspiradora from "@/img/electrodomesticos/aspiradora.png";
import aire from "@/img/electrodomesticos/aire.png";
import CaracteristicasProduct from "./CaracteristicasProduct";
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

export default function ViewProductAppliance({
  product,
}: {
  product: ProductData;
}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const productsMock = [
    {
      id: "RT42DG6220B1CO",
      name: "Neveras Bespoke AI",
      image: nevera,
    },
    {
      id: "DVG24A8870V_CO",
      name: "Bespoke AI Laundry™",
      image: lavadora,
    },
    {
      id: "VR05R5050WK_AP",
      name: "Aspiradoras Bespoke AI",
      image: aspiradora,
    },
    {
      id: "AX40T3030WM_AZ",
      name: "WindFree™- AI Digital Inverteeeeeeeee eeeeeeeeeeeeeeeeeeeee eeeeeeeeeeeeeeeeeee",
      image: aire,
    },
  ];
  // Si no hay producto, busca el primero del mock para desarrollo
  const safeProduct = product || productsMock[0];
  const [selectedColor] = useState(safeProduct?.colors?.[0]);

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

  if (!safeProduct || !safeProduct.colors || safeProduct.colors.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#D9D9D9]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray">
            Producto no encontrado
          </h2>
          <p className="text-gray/80">
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

  return (
    <div
      className="min-h-screen w-full flex flex-col mt-[-10%] pt-[15%]"
      style={{
        background: "#D9D9D9",
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
              className="text-gray text-3xl md:text-5xl font-bold mb-2 hover:text-gray-900 transition-all"
              style={{ fontFamily: "SamsungSharpSans", letterSpacing: "-1px" }}
            >
              {safeProduct.name}
            </h1>
            {/* Logos y badges debajo del nombre */}
            <div className="flex flex-col gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center border border-black bg-white/10"
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
                  className="text-gray text-lg"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Paga hasta en 24 cuotas
                  <br />
                  con Addi
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center border border-black bg-white/10"
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
                  className="text-gray text-lg"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Envío gratis a todo
                  <br />
                  Colombia. *Aplican TYC*
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center border border-black bg-white/10"
                  style={{
                    minWidth: 80,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                  }}
                >
                  <Image
                    src={setingLogo}
                    alt="Setting Logo"
                    width={58}
                    height={58}
                  />
                </div>
                <span
                  className="text-gray text-lg"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Instalación gratis
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
                className="bg-transparent text-black border border-black rounded-full px-4 py-2 font-semibold text-base shadow hover:bg-white/30  transition-all"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleAddToCart}
              >
                Añadir al carrito
              </button>
            </div>
          </div>

          {/* Columna derecha: imagen producto dinámica */}
          <div className="flex-1 flex items-center justify-center p-8">
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
      <ARExperienceHandler
        glbUrl="https://modelado3d.s3.us-east-2.amazonaws.com/Nevera1_5.glb"
        usdzUrl="https://modelado3d.s3.us-east-2.amazonaws.com/Nevera_(1).usdz"
      ></ARExperienceHandler>

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
        className="relative flex items-center justify-center w-full min-h-[600px] "
        style={{
          fontFamily: "SamsungSharpSans",
        }}
      >
        {/* SOLO especificaciones */}
        <EspecificacionesProduct specs={safeProduct.specs} />
      </div>
      <SizeProduct img={medidas}></SizeProduct>
      <CaracteristicasProduct></CaracteristicasProduct>
      {/* Componente de comparación justo debajo de VideosSection */}
      <VideosSection />

      {/* Componente de explorar productos */}
      <div className="pb-8 bg-white">
        <h3
          className="text-gray pb-8 text-3xl text-center md:text-5xl font-bold mb-2 hover:text-gray-900 transition-all"
          style={{ fontFamily: "SamsungSharpSans", letterSpacing: "-1px" }}
        >
          Explora la linea BeSpoke
        </h3>
        <div
          className={cn("grid gap-6 bg-white max-w-7xl mx-auto pl-4 pr-4", {
            "grid-cols-2": true, // Móviles (default)
            "md:grid-cols-4": true, // Desde 'md' (>= 768px)
            "lg:grid-cols-4": true, // Desde 'lg' (>= 1024px)
          })}
        >
          {productsMock.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No se encontraron sugerencias.
            </div>
          ) : (
            productsMock.map((product) => (
              <ExploreProduct
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                onAddToCart={(productId: string, color: string) => {
                  console.log(`Añadir al carrito: ${productId} - ${color}`);
                }}
                className={viewMode === "list" ? "flex-row" : ""}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
