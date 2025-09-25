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

import samsungLogo from "@/img/Samsung_black.png";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { productsMock } from "../components/productsMock";
import ComparationProduct from "./ComparationProduct";
import VideosSection from "./VideosSection";

// Tipos para producto
interface ProductColor {
  name: string;
  hex: string;
}
interface ProductData {
  id: string;
  name: string;
  image: string | StaticImageData; // Permite string o StaticImageData
  price: string;
  originalPrice?: string;
  discount?: string;
  colors: ProductColor[];
  description?: string;
  specs?: { label: string; value: string }[];
}

export default function ViewProduct({
  product,
}: {
  product: Readonly<ProductData>;
  selectedColor?: string;
}) {

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
  const router = useRouter();
  const pathname = usePathname();
  const isProductDetailView = pathname.startsWith("/productos/view/");
  const [showBar, setShowBar] = useState(false);
  const { addProduct } = useCartContext();
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

  useEffect(() => {
    /* Navbar que se bugea al hacer scroll */
    const handleScroll = () => {
      // Solo muestra la barra si el scroll es mayor a 100px y la ruta es de detalles
      setShowBar(window.scrollY > 100 && isProductDetailView);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Inicializa correctamente al montar y tras navegación
    setTimeout(handleScroll, 0);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isProductDetailView]);

  // useEffect para ocultar el navbar principal (solo con showBar)
  useEffect(() => {
    if (showBar) {
      document.body.classList.add("hide-main-navbar");
    } else {
      document.body.classList.remove("hide-main-navbar");
    }
    return () => {
      document.body.classList.remove("hide-main-navbar");
    };
  }, [showBar]);

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
    router.push("/productos/dispositivos-moviles/details");
  };

  return (
     <div
       className="min-h-screen w-full flex flex-col mt-0 pt-0"
       
     >
      {/* Feedback UX al añadir al carrito */}
      {cartFeedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeInContent font-bold text-lg">
          {cartFeedback}
        </div>
      )}
    
      {isProductDetailView && showBar && (
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
        <style>{`
          body.hide-main-navbar header[data-navbar="true"] { display: none !important; }
        `}</style>
       <div className="h-[1px] w-full" />
      {/* Parte 2: Imagen y especificaciones con scroll y animaciones */}
      <motion.div
        ref={specsReveal.ref}
        {...specsReveal.motionProps}
         className="relative flex items-center justify-center w-full min-h-[100px] py-0 mt-0"
      >
        {/* SOLO especificaciones y teléfono juntos, sin duplicar imagen */}
        {/*<EspecificacionesProduct specs={safeProduct.specs} */}
      </motion.div>

       {/* Componente de videos */}
       <motion.div ref={videosReveal.ref} {...videosReveal.motionProps} className="mt-0">
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
