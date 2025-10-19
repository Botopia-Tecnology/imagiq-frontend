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
import BenefitsSection from "./detalles-producto/BenefitsSection";

// Tipo auxiliar para producto de entrada (raw)
type RawProduct = {
  id: string;
  name: string;
  image: string | StaticImageData;
  price: string | number;
  colors: Array<{ name: string; hex: string; label?: string; sku?: string,ean?: string  }>;
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
  ean?: string;
  skuArray?: string[];
  eanArray?: string[];
  puntos_q?: number;
  detailedDescription?: string;
  reviewCount?: number;
  rating?: number;
};

// Utilidad para convertir RawProduct a ProductCardProps compatible
function convertToProductCardProps(product: RawProduct): ProductCardProps {
  // Convertir sku y ean a arrays si son strings
  const skuArray = typeof product.sku === 'string'
    ? product.sku.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(product.skuArray)
      ? product.skuArray
      : [];

  const eanArray = typeof product.ean === 'string'
    ? product.ean.split(',').map(e => e.trim()).filter(Boolean)
    : Array.isArray(product.eanArray)
      ? product.eanArray
      : [];

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
          ean: color.ean || color.name || "EAN",
        }))
      : [],
    selectedColor:
      Array.isArray(product.colors) && product.colors.length > 0
        ? {
            ...product.colors[0],
            label: product.colors[0].label || product.colors[0].name,
            sku: product.colors[0].sku || product.colors[0].name || "SKU",
            ean: product.colors[0].ean || product.colors[0].name || "EAN",
          }
        : undefined,
    sku: product.sku || product.id || "SKU",
    ean: product.ean || product.id || "EAN",
    skuArray: skuArray,
    eanArray: eanArray,
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
  flix,
}: Readonly<{
  product: RawProduct;
  flix?: ProductCardProps;
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
    // Validación estricta: debe existir un SKU válido del color seleccionado
    if (!productCard.selectedColor?.sku) {
      console.error('Error al agregar al carrito:', {
        product_id: safeProduct.id,
        product_name: safeProduct.name,
        selectedColor: productCard.selectedColor,
        available_colors: productCard.colors,
        error: 'No se ha seleccionado un color válido con SKU'
      });
      alert('Por favor selecciona un color antes de agregar al carrito');
      return;
    }

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
      sku: productCard.selectedColor.sku, // SKU estricto del color seleccionado
      ean: productCard.selectedColor.ean,
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
{/*  */}

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
        <Specifications product={productCard} flix={flix} />
      </motion.div>

      {/* Características destacadas (nuevo componente) */}
      {/* <Destacados /> */}

      {/* Sección de beneficios (responsive) */}
      <BenefitsSection />

      {/* Componente de videos */}
      {/* <motion.div
        ref={videosReveal.ref}
        {...videosReveal.motionProps}
        className="mt-0"
      >
        <VideosSection />
      </motion.div> */}
      {/* Componente de comparación justo debajo de VideosSection */}
      {/* <motion.div
        ref={comparationReveal.ref}
        {...comparationReveal.motionProps}
        className="mt-0"
      >
        <ComparationProduct />
      </motion.div> */}
    </div>
  );
}
