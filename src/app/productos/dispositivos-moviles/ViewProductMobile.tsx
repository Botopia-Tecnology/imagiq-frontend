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

import { useCartContext } from "@/features/cart/CartContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";

import { AnimatePresence, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";

import { productsMock } from "../components/productsMock";
import ComparationProduct from "./ComparationProduct";
import Specifications from "@/app/productos/dispositivos-moviles/detalles-producto/Specifications";
import VideosSection from "./VideosSection";
import Destacados from "./detalles-producto/Destacados";

// Tipo auxiliar para producto de entrada (raw)
type RawProduct = {
  id: string;
  name: string;
  image: string | StaticImageData;
  price: string | number;
  colors: Array<{ name: string; hex: string; label?: string; sku?: string }>;
  originalPrice?: string;
  discount?: string;
  description?: string;
  brand?: string;
  model?: string;
  category?: string;
  subcategory?: string;
  capacity?: string;
  stock?: number;
  sku?: string;
  puntos_q?: number;
  detailedDescription?: string;
  reviewCount?: number;
  rating?: number;
};

// Utilidad para convertir RawProduct a ProductCardProps compatible
function convertToProductCardProps(product: RawProduct): ProductCardProps {
  return {
    id: String(product.id ?? ""),
    name: String(product.name ?? ""),
    image: product.image ?? "",
    price:
      typeof product.price === "string" ? product.price : String(product.price),
    colors: Array.isArray(product.colors)
      ? product.colors.map((color) => ({
          ...color,
          label: color.label || color.name,
          sku: color.sku || color.name || "SKU",
        }))
      : [],
    selectedColor:
      Array.isArray(product.colors) && product.colors.length > 0
        ? {
            ...product.colors[0],
            label: product.colors[0].label || product.colors[0].name,
            sku: product.colors[0].sku || product.colors[0].name || "SKU",
          }
        : undefined,
    sku: product.sku || product.id || "SKU",
    puntos_q: product.puntos_q ?? 4,
    originalPrice: product.originalPrice,
    discount: product.discount,
    description: product.description,
    brand: product.brand,
    model: product.model,
    category: product.category,
    subcategory: product.subcategory,
    capacity: product.capacity,
    stock: product.stock,
    detailedDescription: product.detailedDescription,
    reviewCount: product.reviewCount,
    rating: product.rating,
  };
}

export default function ViewProduct({
  product,
}: Readonly<{
  product: RawProduct;
}>) {
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
  const comparationReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  // Si no hay producto, busca el primero del mock para desarrollo
  const safeProduct = product || productsMock[0];
  // Conversión a tipo compatible para especificaciones y carrito
  const productCard = React.useMemo(
    () => convertToProductCardProps(safeProduct),
    [safeProduct]
  );
  const router = useRouter();
  const pathname = usePathname();
  const isProductDetailView = pathname?.startsWith("/productos/view/") ?? false;
  const { addProduct } = useCartContext();
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

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

  if (!safeProduct?.colors?.length) {
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
  // Mejorado: Comprar, navega al carrito
  const handleBuy = () => {
    router.push("/carrito");
  };

  return (
    <div className="min-h-screen w-full flex flex-col mt-0 pt-0">
      {/* Feedback UX al añadir al carrito */}
      {cartFeedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeInContent font-bold text-lg">
          {cartFeedback}
        </div>
      )}

      {/* Navbar fijo con animación ELEGANTE y suave - Entrada cinematográfica */}
      <AnimatePresence mode="wait">
        {showNavbarFixed && (
          <motion.div
            key="fixed-navbar"
            initial={{
              y: -100,
              opacity: 0,
              scale: 0.95,
              filter: "blur(4px)",
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              y: -100,
              opacity: 0,
              scale: 0.98,
              filter: "blur(2px)",
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 35,
              mass: 1.2,
              opacity: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              scale: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              filter: {
                duration: 0.45,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }}
            className="fixed-navbar-container w-full bg-white/92 backdrop-blur-xl shadow-2xl h-[72px] flex items-center px-4 pt-2 border-b border-gray-200/30"
            style={{
              fontFamily: "SamsungSharpSans",
              zIndex: 9999,
              backdropFilter: "blur(20px) saturate(1.1)",
              WebkitBackdropFilter: "blur(20px) saturate(1.1)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* MOBILE: solo nombre y botón comprar con animación escalonada */}
            <div className="flex w-full items-center justify-between md:hidden">
              {/* Nombre a la izquierda */}
              <motion.span
                initial={{ x: -25, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 0.25,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="font-bold text-base text-black text-left truncate"
                style={{ fontFamily: "SamsungSharpSans", maxWidth: "60vw" }}
              >
                {safeProduct.name}
              </motion.span>
              {/* Botón comprar a la derecha */}
              <motion.button
                initial={{ x: 25, opacity: 0, scale: 0.92 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
                  transition: { duration: 0.25 },
                }}
                whileTap={{ scale: 0.99 }}
                transition={{
                  delay: 0.35,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="bg-black text-white rounded-full px-4 py-2 h-10 font-semibold text-sm shadow-lg hover:bg-gray-900 transition-all min-w-[90px]"
                style={{ fontFamily: "SamsungSharpSans" }}
                onClick={handleBuy}
              >
                Comprar
              </motion.button>
            </div>
            {/* DESKTOP/TABLET: diseño con animaciones elegantes escalonadas */}
            <div className="hidden md:flex w-full items-center justify-between">
              {/* Parte izquierda: logos con entrada desde la izquierda */}
              <motion.div
                initial={{ x: -35, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex items-end flex-shrink-0 gap-2 md:gap-4"
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Image
                    src="/frame_black.png"
                    alt="Q Logo"
                    height={40}
                    style={{ display: "block", marginBottom: "5px" }}
                    width={40}
                    className="h-[40px] w-[40px] min-w-[40px] md:h-[48px] md:w-[48px] md:min-w-[40px]"
                    priority
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.85, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Link
                    href="/"
                    aria-label="Ir a la página principal"
                    className="block cursor-pointer"
                  >
                    <Image
                      src="/img/Samsung_black.svg"
                      alt="Samsung Logo"
                      height={80}
                      width={70}
                      className="h-10 md:h-12 w-auto"
                      style={{ display: "block" }}
                    />
                  </Link>
                </motion.div>
                <motion.span
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="text-xs font-bold tracking-wide text-black select-none"
                  style={{
                    letterSpacing: "0.08em",
                    marginBottom: "11px",
                    lineHeight: "normal",
                    alignSelf: "flex-end",
                  }}
                >
                  Store
                </motion.span>
              </motion.div>

              {/* Nombre centrado con entrada desde arriba */}
              <motion.div
                initial={{ y: -15, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex-1 flex justify-center"
              >
                <span
                  className="font-bold text-base md:text-lg text-center"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  {safeProduct.name}
                </span>
              </motion.div>

              {/* Parte derecha: botones con entrada desde la derecha */}
              <motion.div
                initial={{ x: 35, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 0.7,
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex items-center gap-2"
                style={{ minWidth: 110 }}
              >
                {/* Botón añadir al carrito */}
                <motion.button
                  initial={{ scale: 0.92, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.015,
                    y: -1,
                    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.08)",
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.995, y: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="bg-transparent text-black border border-black rounded-full px-8 py-2 h-12 font-semibold text-base shadow-md hover:bg-black hover:text-white transition-all mb-3 mt-3 min-w-[130px]"
                  style={{ fontFamily: "SamsungSharpSans" }}
                  onClick={handleAddToCart}
                >
                  Añadir al carrito
                </motion.button>
                {/* Botón comprar */}
                <motion.button
                  initial={{ scale: 0.92, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.015,
                    y: -1,
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.995, y: 0 }}
                  transition={{
                    delay: 0.9,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="bg-black text-white rounded-full px-6 py-2 h-12 font-semibold text-base shadow-lg hover:bg-gray-900 transition-all mb-3 mt-3 min-w-[110px]"
                  style={{ fontFamily: "SamsungSharpSans" }}
                  onClick={handleBuy}
                >
                  Comprar
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos CSS globales optimizados para transiciones cinematográficas */}
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
          
          /* Asegurar que el navbar fijo tenga prioridad visual absoluta */
          .fixed-navbar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            will-change: transform, opacity, filter !important;
          }
          
          /* Efecto de cristal mejorado para el navbar fijo */
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
          
          /* Animación de entrada más suave para elementos internos */
          .fixed-navbar-container * {
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        `,
        }}
      />
      <div className="h-[1px] w-full" />
      {/* Parte 2: Imagen y especificaciones con scroll y animaciones */}
      <motion.div
        ref={specsReveal.ref}
        {...specsReveal.motionProps}
        className="relative flex items-center justify-center w-full min-h-[100px] py-0 md:-mt-40"
      >
        {/* Especificaciones técnicas dinámicas del producto */}
        <Specifications product={productCard} />
      </motion.div>

      {/* Características destacadas (nuevo componente) */}
      <Destacados />

      {/* Componente de videos */}
      <motion.div
        ref={videosReveal.ref}
        {...videosReveal.motionProps}
        className="mt-0"
      >
        <VideosSection />
      </motion.div>
      {/* Componente de comparación justo debajo de VideosSection */}
      <motion.div
        ref={comparationReveal.ref}
        {...comparationReveal.motionProps}
        className="mt-0"
      >
        <ComparationProduct />
      </motion.div>
    </div>
  );
}
