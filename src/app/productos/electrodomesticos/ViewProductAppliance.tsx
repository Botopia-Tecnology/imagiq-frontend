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
import dynamic from "next/dynamic";
import { useCartContext } from "@/features/cart/CartContext";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import addiLogo from "@/img/iconos/addi_negro.png";
import setingLogo from "@/img/iconos/Setting_line_negro.png";
import packageCar from "@/img/iconos/package_car_negro.png";
import samsungLogo from "@/img/Samsung_black.png";
import EspecificacionesProduct from "./EspecificacionesProduct";
import medidas from "../../../img/electrodomesticos/medidas.png";
import VideosSection from "./VideosSection";
import { usePathname, useRouter } from "next/navigation";
import ARExperienceHandler from "./components/ARExperienceHandler";
import SizeProduct from "./components/SizeProduct";
import { productsMock } from "../components/productsMock";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CaracteristicasProduct from "./CaracteristicasProduct";
import SkeletonCard from "@/components/SkeletonCard";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
// Tipos para producto
interface ProductColor {
  name: string;
  hex: string;
}
interface ProductData {
  id: string;
  name: string;
  image: string | StaticImageData;
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
  product: Readonly<ProductData>;
}) {
  // Animación scroll reveal para hero principal
  const heroReveal = useScrollReveal<HTMLDivElement>({
    offset: 80,
    duration: 600,
    direction: "up",
  });
  // Animación scroll reveal para especificaciones
  const specsReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });
  // Animación scroll reveal para videos
  const videosReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });
  // Animación scroll reveal para comparación
  const exploreReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  // Si no hay producto, busca el primero del mock para desarrollo
  const safeProduct = product || productsMock[0];
  const router = useRouter();
  const pathname = usePathname();
  const { addProduct } = useCartContext();
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const isProductDetailView = pathname?.startsWith("/productos/view/") ?? false;

  /**
   * Hook personalizado para control avanzado del navbar fijo - ANTI-FLICKER
   * Usa histeresis amplia con thresholdShow=150px y thresholdHide=50px
   * Zona de amortiguación de 100px previene toggles constantes
   * Solo activo en vistas de detalle de producto
   */
  const showNavbarFixed = useScrollNavbar(150, 50, isProductDetailView);

  /**
   * Efecto optimizado para control del navbar principal
   * Aplica/quita clase global con timing perfecto para evitar parpadeos
   */
  useEffect(() => {
    if (typeof document === "undefined") return; // Protección SSR
    if (showNavbarFixed) {
      // Inmediatamente ocultar navbar principal cuando aparece el fijo
      document.body.classList.add("hide-main-navbar");
    } else {
      // Delay optimizado para permitir transición suave del navbar fijo
      const timer = setTimeout(() => {
        document.body.classList.remove("hide-main-navbar");
      }, 250); // Sincronizado con nueva duración de animación exit más lenta
      return () => clearTimeout(timer);
    }
    // Cleanup: siempre remover la clase al desmontar
    return () => {
      document.body.classList.remove("hide-main-navbar");
    };
  }, [showNavbarFixed]);

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
  // Mejorado: Añadir al carrito igual que ProductCard
  const handleAddToCart = () => {
    addProduct({
      id: safeProduct.id,
      name: safeProduct.name,
      image:
        typeof safeProduct.image === "string"
          ? safeProduct.image
          : safeProduct.image.src || "",
      price:
        typeof safeProduct.price === "string"
          ? parseInt(safeProduct.price.replace(/[^\d]/g, ""))
          : safeProduct.price || 0,
      quantity: 1,
      sku: safeProduct.id, // Add required sku property
    });
    setCartFeedback("Producto añadido al carrito");
    setTimeout(() => setCartFeedback(null), 1200);
  };
  // Mejorado: Comprar, navega a DetailsProduct
  const handleBuy = () => {
    router.push("/productos/electrodomesticos/details");
  };

  const ExploreProducts = dynamic(() => import("./ExploreProducts"), {
    loading: () => (
      <div className="bg-white">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 max-w-7xl mx-auto pl-4 pr-4 py-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    ),
    ssr: false, // opcional, si quieres que solo se renderice en el cliente
  });

  return (
    <div
      className="min-h-screen w-full flex flex-col pt-10 bg-gray-200/60"
      style={{
        fontFamily: "SamsungSharpSans",
      }}
    >
      {/* Feedback UX al añadir al carrito */}
      {cartFeedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeInContent font-bold text-lg">
          {cartFeedback}
        </div>
      )}
      <ARExperienceHandler
        glbUrl="https://modelado3d.s3.us-east-2.amazonaws.com/Nevera_nueva.glb"
        usdzUrl="https://modelado3d.s3.us-east-2.amazonaws.com/Nevera_(1).usdz"
      ></ARExperienceHandler>

      {/* Barra superior solo si está en detalles y ha hecho scroll */}
      {isProductDetailView && showNavbarFixed && (
        <div
          className="w-full bg-white shadow-sm h-[72px] flex items-center px-4 fixed top-0 pt-2 left-0 z-40 animate-fadeInContent"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          {/* MOBILE: solo nombre y botón comprar */}
          <div className="flex w-full items-center justify-between md:hidden">
            {/* Nombre a la izquierda */}
            <span
              className="font-bold text-base text-black text-left truncate"
              style={{ fontFamily: "SamsungSharpSans", maxWidth: "60vw" }}
            >
              {safeProduct.name}
            </span>
            {/* Botón comprar a la derecha */}
            <button
              className="bg-black text-white rounded-full px-4 py-2 h-10 font-semibold text-sm shadow hover:bg-gray-900 transition-all min-w-[90px]"
              style={{ fontFamily: "SamsungSharpSans" }}
              onClick={handleBuy}
            >
              Comprar
            </button>
          </div>
          {/* DESKTOP/TABLET: diseño original */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Parte izquierda: imagen frame_311_black + logo Samsung + imagen store_black */}
            <div className="flex items-end flex-shrink-0 gap-2 md:gap-4">
              <Image
                src="/frame_black.png"
                alt="Q Logo"
                height={40}
                style={{ display: "block", marginBottom: "5px" }}
                width={40}
                className="h-[40px] w-[40px] min-w-[40px] md:h-[48px] md:w-[48px] md:min-w-[40px]"
                priority
              />
              <Image
                src={samsungLogo}
                alt="Samsung Logo"
                onClick={() => {
                  window.location.href = "/";
                }}
                height={80}
                width={70}
                className="h-10 md:h-12 w-auto cursor-pointer"
                priority
                style={{ display: "block" }}
              />

              <span
                className={
                  "text-xs font-bold tracking-wide text-black select-none"
                }
                style={{
                  letterSpacing: "0.08em",
                  marginBottom: "11px", // Ajusta este valor según sea necesario
                  lineHeight: "normal", // O ajusta el line-height según lo necesites
                  alignSelf: "flex-end", // Esto alinea el texto con el fondo de las imágenes
                }}
              >
                Store
              </span>
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
                className="bg-transparent text-black border border-black rounded-full px-8 py-2 h-12 font-semibold text-base shadow hover:bg-black hover:text-white transition-all mb-3 mt-3 min-w-[130px]"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleAddToCart}
              >
                Añadir al carrito
              </button>
              {/* Botón comprar */}
              <button
                className="bg-black text-white rounded-full px-6 py-2 h-12 font-semibold text-base shadow hover:bg-gray-900 transition-all mb-3 mt-3 min-w-[110px]"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleBuy}
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Oculta el navbar principal con una clase global */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          body.hide-main-navbar header[data-navbar="true"] { 
            transform: translateY(-100%) scale(0.97) !important;
            opacity: 0 !important;
            filter: blur(3px) !important;
            transition: 
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
            pointer-events: none !important;
          }
          .fixed-navbar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            will-change: transform, opacity, filter !important;
          }
          .fixed-navbar-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            border-radius: inherit;
            pointer-events: none;
          }
          .fixed-navbar-container * {
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        `,
        }}
      />
      <div className="h-[56px] w-full" />
      {/* Parte 2: Imagen y especificaciones con scroll y animaciones */}
      <motion.div ref={specsReveal.ref} {...specsReveal.motionProps}>
        <EspecificacionesProduct specs={safeProduct.specs} />
        <SizeProduct img={medidas}></SizeProduct>
      </motion.div>
      <motion.div ref={videosReveal.ref} {...videosReveal.motionProps}>
        <CaracteristicasProduct></CaracteristicasProduct>
        <VideosSection />
      </motion.div>
      <motion.div ref={exploreReveal.ref} {...exploreReveal.motionProps}>
        <ExploreProducts
          title="Explora la linea BeSpoke"
          filters={{ descriptionKeyword: "Bespoke" }}
          limit={4}
        ></ExploreProducts>
      </motion.div>
    </div>
  );
}
